import { describe, expect, it } from "vitest";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

describe("Bata admin router", () => {
  it("rejects catalog-management requests from non-admin users before accessing catalog data", async () => {
    const ctx: TrpcContext = {
      user: { id: 2, openId: "shopper", name: "Shopper", email: "shopper@example.com", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    await expect(appRouter.createCaller(ctx).admin.products()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
