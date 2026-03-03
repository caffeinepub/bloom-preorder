import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Address = {
    street : Text;
    city : Text;
    state : Text;
    pincode : Text;
  };

  type Preorder = {
    id : Principal;
    name : Text;
    email : Text;
    phone : Text;
    address : Address;
    quantity : Nat;
    paymentMethod : Text;
    status : Text;
    createdAt : Time.Time;
  };

  let preorders = Map.empty<Principal, Preorder>();

  public shared ({ caller }) func submitPreorder(
    name : Text,
    email : Text,
    phone : Text,
    street : Text,
    city : Text,
    state : Text,
    pincode : Text,
    quantity : Nat,
  ) : async () {
    if (preorders.containsKey(caller)) {
      Runtime.trap("Preorder already submitted with this caller.");
    };
    let address : Address = {
      street;
      city;
      state;
      pincode;
    };
    let preorder : Preorder = {
      id = caller;
      name;
      email;
      phone;
      address;
      quantity;
      paymentMethod = "COD";
      status = "pending";
      createdAt = Time.now();
    };
    preorders.add(caller, preorder);
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Principal, newStatus : Text) : async () {
    switch (preorders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?existingOrder) {
        let updatedOrder : Preorder = {
          existingOrder with status = newStatus;
        };
        preorders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getTotalPreorders() : async Nat {
    preorders.size();
  };

  public query ({ caller }) func getAllPreorders() : async [Preorder] {
    preorders.values().toArray();
  };
};
