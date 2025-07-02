from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
import re
import secrets
import string
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Database initialization
def init_db():
    conn = sqlite3.connect('passwords.db')
    c = conn.cursor()
    
    # Users table
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE NOT NULL,
                  password_hash TEXT NOT NULL,
                  salt BLOB NOT NULL)''')
    
    # Password entries table
    c.execute('''CREATE TABLE IF NOT EXISTS password_entries
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER,
                  site_name TEXT NOT NULL,
                  username TEXT,
                  encrypted_password BLOB NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users (id))''')
    
    conn.commit()
    conn.close()

# Encryption utilities
def generate_key_from_password(password: str, salt: bytes) -> bytes:
    """Generate encryption key from master password"""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
    return key

def encrypt_password(password: str, key: bytes) -> bytes:
    """Encrypt password using Fernet"""
    f = Fernet(key)
    return f.encrypt(password.encode())

def decrypt_password(encrypted_password: bytes, key: bytes) -> str:
    """Decrypt password using Fernet"""
    f = Fernet(key)
    return f.decrypt(encrypted_password).decode()

# Password strength checker
def check_password_strength(password):
    """Check password strength and return score with feedback"""
    score = 0
    feedback = []
    
    # Length check
    if len(password) >= 8:
        score += 1
    else:
        feedback.append("Use at least 8 characters")
    
    if len(password) >= 12:
        score += 1
    
    # Character variety checks
    if re.search(r'[a-z]', password):
        score += 1
    else:
        feedback.append("Include lowercase letters")
    
    if re.search(r'[A-Z]', password):
        score += 1
    else:
        feedback.append("Include uppercase letters")
    
    if re.search(r'\d', password):
        score += 1
    else:
        feedback.append("Include numbers")
    
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 1
    else:
        feedback.append("Include special characters")
    
    # Pattern checks
    if not re.search(r'(.)\1{2,}', password):  # No 3+ repeated chars
        score += 1
    else:
        feedback.append("Avoid repeated characters")
    
    # Strength levels
    if score <= 2:
        strength = "weak"
        color = "red"
    elif score <= 4:
        strength = "medium"
        color = "yellow"
    elif score <= 6:
        strength = "strong"
        color = "green"
    else:
        strength = "very strong"
        color = "green"
    
    return {
        "score": score,
        "max_score": 7,
        "strength": strength,
        "color": color,
        "feedback": feedback
    }

# Routes
@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # Generate salt for encryption key
        salt = os.urandom(32)
        
        # Hash password for authentication
        password_hash = generate_password_hash(password)
        
        try:
            conn = sqlite3.connect('passwords.db')
            c = conn.cursor()
            c.execute("INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)",
                     (username, password_hash, salt))
            conn.commit()
            conn.close()
            
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            flash('Username already exists!', 'error')
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        conn = sqlite3.connect('passwords.db')
        c = conn.cursor()
        c.execute("SELECT id, password_hash, salt FROM users WHERE username = ?", (username,))
        user = c.fetchone()
        conn.close()
        
        if user and check_password_hash(user[1], password):
            session['user_id'] = user[0]
            session['username'] = username
            session['encryption_key'] = generate_key_from_password(password, user[2])
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid credentials!', 'error')
    
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    conn = sqlite3.connect('passwords.db')
    c = conn.cursor()
    c.execute("SELECT id, site_name, username, created_at FROM password_entries WHERE user_id = ?",
              (session['user_id'],))
    entries = c.fetchall()
    conn.close()
    
    return render_template('dashboard.html', entries=entries)

@app.route('/add_password', methods=['GET', 'POST'])
def add_password():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        site_name = request.form['site_name']
        username = request.form['username']
        password = request.form['password']
        
        # Encrypt the password
        encrypted_password = encrypt_password(password, session['encryption_key'])
        
        conn = sqlite3.connect('passwords.db')
        c = conn.cursor()
        c.execute("INSERT INTO password_entries (user_id, site_name, username, encrypted_password) VALUES (?, ?, ?, ?)",
                 (session['user_id'], site_name, username, encrypted_password))
        conn.commit()
        conn.close()
        
        flash('Password saved successfully!', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('add_password.html')

@app.route('/view_password/<int:entry_id>')
def view_password(entry_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    conn = sqlite3.connect('passwords.db')
    c = conn.cursor()
    c.execute("SELECT site_name, username, encrypted_password FROM password_entries WHERE id = ? AND user_id = ?",
              (entry_id, session['user_id']))
    entry = c.fetchone()
    conn.close()
    
    if entry:
        decrypted_password = decrypt_password(entry[2], session['encryption_key'])
        return jsonify({
            'site_name': entry[0],
            'username': entry[1],
            'password': decrypted_password
        })
    
    return jsonify({'error': 'Entry not found'}), 404

@app.route('/generate_password')
def generate_password():
    length = int(request.args.get('length', 16))
    include_symbols = request.args.get('symbols', 'true') == 'true'
    
    characters = string.ascii_letters + string.digits
    if include_symbols:
        characters += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    password = ''.join(secrets.choice(characters) for _ in range(length))
    strength = check_password_strength(password)
    
    return jsonify({
        'password': password,
        'strength': strength
    })

@app.route('/check_strength', methods=['POST'])
def check_strength():
    password = request.json.get('password', '')
    return jsonify(check_password_strength(password))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
