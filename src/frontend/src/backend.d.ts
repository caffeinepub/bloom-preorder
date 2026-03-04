import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Address {
    street: string;
    city: string;
    state: string;
    pincode: string;
}
export type Time = bigint;
export interface Preorder {
    id: bigint;
    status: string;
    paymentMethod: string;
    name: string;
    createdAt: Time;
    email: string;
    address: Address;
    quantity: bigint;
    phone: string;
}
export interface VisitStats {
    today: bigint;
    last7Days: bigint;
    yesterday: bigint;
}
export interface backendInterface {
    getAllPreorders(): Promise<Array<Preorder>>;
    getTotalPreorders(): Promise<bigint>;
    getVisitStats(): Promise<VisitStats>;
    recordVisit(): Promise<void>;
    submitPreorder(name: string, email: string, phone: string, street: string, city: string, state: string, pincode: string, quantity: bigint): Promise<bigint>;
    updateOrderStatus(orderId: bigint, newStatus: string): Promise<void>;
}
