import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Preorder {
    name: string;
    email: string;
    quantity: bigint;
}
export interface backendInterface {
    getAllPreorders(): Promise<Array<Preorder>>;
    getTotalPreorders(): Promise<bigint>;
    submitPreorder(name: string, email: string, quantity: bigint): Promise<void>;
}
