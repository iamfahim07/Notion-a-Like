const { create } = require("zustand");

export const useCoverImage = create((set) => ({
  storageId: undefined,
  isOpen: false,
  onOpen: () => set({ isOpen: true, storageId: undefined }),
  onClose: () => set({ isOpen: false, storageId: undefined }),
  onReplace: (storageId) => set({ isOpen: true, storageId }),
}));
