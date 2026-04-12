import axios from "axios";
import { clearSession, getAuthErrorMessage, AUTH_TOKEN_KEY, AUTH_ROLE_KEY } from "../src/services/auth";

describe("auth helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("clearSession", () => {
    it("removes token and role from localStorage", () => {
      localStorage.setItem(AUTH_TOKEN_KEY, "abc");
      localStorage.setItem(AUTH_ROLE_KEY, "admin");
      clearSession();
      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(AUTH_ROLE_KEY)).toBeNull();
    });
  });

  describe("getAuthErrorMessage", () => {
    it("returns string message from axios error response", () => {
      const err = new axios.AxiosError("fail", "ERR", {}, {}, {
        status: 400,
        data: { message: "Invalid credentials" },
      });
      expect(getAuthErrorMessage(err)).toBe("Invalid credentials");
    });

    it("joins array messages", () => {
      const err = new axios.AxiosError("fail", "ERR", {}, {}, {
        status: 422,
        data: { message: ["a", "", "b"] },
      });
      expect(getAuthErrorMessage(err)).toBe("a, b");
    });

    it("returns network hint when there is no response", () => {
      const err = new axios.AxiosError("network", "ERR_NETWORK", {}, {});
      err.response = undefined;
      expect(getAuthErrorMessage(err)).toBe(
        "Unable to reach the server. Check that the backend is running and try again."
      );
    });

    it("uses actionFallback for non-axios errors", () => {
      expect(getAuthErrorMessage(new Error("x"), { actionFallback: "custom" })).toBe("custom");
    });
  });
});
