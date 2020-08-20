import { Router, Request, Response } from "express";
import { requireAuth } from "@mhticketsss/common";
import { Order } from "../../models/Order";

const router = Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({
      userId: req.currentUser!.id,
    }).populate("ticket");
    res.send(orders);
  } catch (error) {
    console.log(error);
  }
});

export { router as indexRouter };
