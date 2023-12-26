import { create } from "zustand";

type CardAddFlowState = {
  card_id?: string;
  setCardId: (cardId: string) => void;
  reset: () => void;
};
export const useCardAddFlow = create<CardAddFlowState>((set) => ({
  setCardId: (id) => set({ card_id: id }),
  reset: () => set({ card_id: undefined }),
}));
