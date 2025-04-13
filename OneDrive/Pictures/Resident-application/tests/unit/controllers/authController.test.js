const authController = require("../../../src/controllers/authController")
const { User, Resident } = require("../../../src/models")
const encryptionService = require("../../../src/services/encryptionService")
const { OAuth2Client } = require("google-auth-library")

// Mock dependencies
jest.mock("../../../src/models")
jest.mock("../../../src/services/encryptionService")
jest.mock("google-auth-library")

describe("Auth Controller", () => {
  let req
  let res

  beforeEach(() => {
    req = {
      body: {},
      user: {
        user_id: 1,
        user_type: "resident",
      },
      googleUser: {
        name: "Test User",
        email: "test@example.com",
        picture: "https://example.com/picture.jpg",
      },
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    // Reset mocks
    jest.clearAllMocks()
  })

  describe("googleAuth", () => {
    it("should authenticate a user with Google token", async () => {
      // Setup
      const mockPayload = {
        sub: "google123",
        email: "test@example.com",
        name: "Test User",
        picture: "https://example.com/picture.jpg",
      }

      const mockTicket = {
        getPayload: jest.fn().mockReturnValue(mockPayload),
      }

      OAuth2Client.prototype.verifyIdToken = jest.fn().mockResolvedValue(mockTicket)

      User.findOne = jest.fn().mockResolvedValue({
        user_id: 1,
        google_id: "google123",
        user_type: "resident",
        update: jest.fn().mockResolvedValue(true),
      })

      req.body = {
        token: "valid-token",
        userType: "resident",
      }

      // Execute
      await authController.googleAuth(req, res)

      // Assert
      expect(OAuth2Client.prototype.verifyIdToken).toHaveBeenCalledWith({
        idToken: "valid-token",
        audience: process.env.GOOGLE_CLIENT_ID,
      })

      expect(User.findOne).toHaveBeenCalledWith({
        where: { google_id: "google123" },
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            token: expect.any(String),
            user: expect.objectContaining({
              id: 1,
              type: "resident",
            }),
          }),
        }),
      )
    })

    it("should create a new user if not found", async () => {
      // Setup
      const mockPayload = {
        sub: "google123",
        email: "test@example.com",
        name: "Test User",
        picture: "https://example.com/picture.jpg",
      }

      const mockTicket = {
        getPayload: jest.fn().mockReturnValue(mockPayload),
      }

      OAuth2Client.prototype.verifyIdToken = jest.fn().mockResolvedValue(mockTicket)

      User.findOne = jest.fn().mockResolvedValue(null)
      User.create = jest.fn().mockResolvedValue({
        user_id: 1,
        google_id: "google123",
        user_type: "resident",
      })

      Resident.create = jest.fn().mockResolvedValue({
        resident_id: 1,
        user_id: 1,
      })

      req.body = {
        token: "valid-token",
        userType: "resident",
      }

      // Execute
      await authController.googleAuth(req, res)

      // Assert
      expect(User.create).toHaveBeenCalledWith({
        google_id: "google123",
        user_type: "resident",
        status: "active",
      })

      expect(Resident.create).toHaveBeenCalledWith({
        user_id: 1,
        membership_type: "standard",
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        }),
      )
    })
  })

  describe("updateAddress", () => {
    it("should update resident address", async () => {
      // Setup
      Resident.findOne = jest.fn().mockResolvedValue({
        resident_id: 1,
        user_id: 1,
        update: jest.fn().mockResolvedValue(true),
      })

      encryptionService.encrypt = jest.fn().mockReturnValue("encrypted-address")

      req.body = {
        address: "123 Main St",
      }

      // Execute
      await authController.updateAddress(req, res)

      // Assert
      expect(encryptionService.encrypt).toHaveBeenCalledWith("123 Main St")
      expect(Resident.findOne).toHaveBeenCalledWith({
        where: { user_id: 1 },
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Address updated successfully",
        }),
      )
    })

    it("should return 403 if user is not a resident", async () => {
      // Setup
      req.user.user_type = "staff"

      // Execute
      await authController.updateAddress(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Only residents can update address",
        }),
      )
    })
  })
})
