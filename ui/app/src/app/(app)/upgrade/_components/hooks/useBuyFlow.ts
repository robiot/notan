import { create } from "zustand";

type BuyFlowState = {
  page?: "plan" | "payment" | "add_card" | "success" | "error";
  title?: string;
  payment_method_id?: string;
  price_key?: string;
  product_id?: string;
  product_info?: {
    type: "subscription" | "one-time";
    subscription_period?: {
      title: string;
      period: "month" | "year";
    };
  };
};
type BuyFlowT = {
  flowState: BuyFlowState;
  setPage: (page: BuyFlowState["page"]) => void;
  setFlowState: (flowState: BuyFlowState) => void;
  resetFlowState: () => void;
};

export const useBuyFlow = create<BuyFlowT>((set, get) => ({
  flowState: {},
  setPage: (page) => set({ flowState: { ...get().flowState, page } }),
  setFlowState: (flowState) => set({ flowState }),
  resetFlowState: () => set({ flowState: {} }),
}));
