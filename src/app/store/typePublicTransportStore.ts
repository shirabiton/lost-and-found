import { create } from "zustand";
import { TypePublicTransportStore } from "../types/store/typePublicTransportStore";

const typePublicTransportStore = create<TypePublicTransportStore>((set) => ({
    typePublicTransports: null,
    setTypePublicTransports: (typePublicTransports) => set(() => ({ typePublicTransports }))
}))

export default typePublicTransportStore;