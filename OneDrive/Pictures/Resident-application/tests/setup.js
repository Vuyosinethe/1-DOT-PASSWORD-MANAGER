// Mock environment variables
process.env.JWT_SECRET = "test-jwt-secret"
process.env.ENCRYPTION_KEY = "test-encryption-key-32-chars-long!"
process.env.GOOGLE_CLIENT_ID = "test-google-client-id"

// Mock sequelize
jest.mock("../src/config/database", () => {
  const SequelizeMock = require("sequelize-mock")
  const dbMock = new SequelizeMock()

  return {
    sequelize: dbMock,
    testConnection: jest.fn().mockResolvedValue(true),
  }
})

// Mock logger to prevent console output during tests
jest.mock("../src/utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}))
