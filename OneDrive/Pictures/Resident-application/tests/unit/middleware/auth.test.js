const { protect, restrictTo } = require("../../../src/middleware/auth")
const { User } = require("../../../src/models")
const jwt = require("jsonwebtoken")

// Mock dependencies
jest.mock("../../../src/models")
jest.mock("jsonwebtoken")

describe("Auth Middleware", () => {
  let req
  let res
  let next

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer valid-token",
      },
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    next = jest.fn()

    // Reset mocks
    jest.clearAllMocks()
  })

  describe("protect", () => {
    it("should call next() if token is valid", async () => {
      // Setup
      jwt.verify = jest.fn().mockReturnValue({ id: 1 })

      User.findByPk = jest.fn().mockResolvedValue({
        user_id: 1,
        user_type: "resident",
      })

      // Execute
      await protect(req, res, next)

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith("valid-token", process.env.JWT_SECRET)
      expect(User.findByPk).toHaveBeenCalledWith(1)
      expect(req.user).toEqual({
        user_id: 1,
        user_type: "resident",
      })
      expect(next).toHaveBeenCalled()
    })

    it("should return 401 if no token is provided", async () => {
      // Setup
      req.headers.authorization = undefined

      // Execute
      await protect(req, res, next)

      // Assert
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Please log in to access this resource",
        }),
      )
      expect(next).not.toHaveBeenCalled()
    })

    it("should return 401 if token is invalid", async () => {
      // Setup
      jwt.verify = jest.fn().mockReturnValue(null)

      // Execute
      await protect(req, res, next)

      // Assert
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Invalid or expired token",
        }),
      )
      expect(next).not.toHaveBeenCalled()
    })

    it("should return 401 if user does not exist", async () => {
      // Setup
      jwt.verify = jest.fn().mockReturnValue({ id: 1 })
      User.findByPk = jest.fn().mockResolvedValue(null)

      // Execute
      await protect(req, res, next)

      // Assert
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "The user belonging to this token no longer exists",
        }),
      )
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe("restrictTo", () => {
    it("should call next() if user has required role", () => {
      // Setup
      req.user = {
        user_type: "admin",
      }

      const middleware = restrictTo("admin", "staff")

      // Execute
      middleware(req, res, next)

      // Assert
      expect(next).toHaveBeenCalled()
    })

    it("should return 403 if user does not have required role", () => {
      // Setup
      req.user = {
        user_type: "resident",
      }

      const middleware = restrictTo("admin", "staff")

      // Execute
      middleware(req, res, next)

      // Assert
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "You do not have permission to perform this action",
        }),
      )
      expect(next).not.toHaveBeenCalled()
    })
  })
})
