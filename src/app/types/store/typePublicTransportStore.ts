import { TypePublicTransport } from "../props/typePublicTransport";

export interface TypePublicTransportStore {
    typePublicTransports: TypePublicTransport[] | null;
    setTypePublicTransports: (typePublicTransports: TypePublicTransport[] | null) => void;
}