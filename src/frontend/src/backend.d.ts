import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export interface Address {
    street: string;
    city: string;
    state: string;
    pincode: string;
}
export interface backendInterface {
    getAllPreorders(): Promise<Array<Preorder>>;
    getTotalPreorders(): Promise<bigint>;
    submitPreorder(name: string, email: string, phone: string, street: string, city: string, state: string, pincode: string, quantity: bigint): Promise<bigint>;
    updateOrderStatus(orderId: bigint, newStatus: string): Promise<void>;
}
