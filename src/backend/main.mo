import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";



actor {
  type Address = {
    street : Text;
    city : Text;
    state : Text;
    pincode : Text;
  };

  type Preorder = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    address : Address;
    quantity : Nat;
    paymentMethod : Text;
    status : Text;
    createdAt : Time.Time;
  };

  stable var orderIdCounter = 0;
  let preorders = Map.empty<Nat, Preorder>();

  public shared ({ caller }) func submitPreorder(
    name : Text,
    email : Text,
    phone : Text,
    street : Text,
    city : Text,
    state : Text,
    pincode : Text,
    quantity : Nat,
  ) : async Nat {
    let orderId = orderIdCounter;
    orderIdCounter += 1;

    let address : Address = {
      street;
      city;
      state;
      pincode;
    };

    let preorder : Preorder = {
      id = orderId;
      name;
      email;
      phone;
      address;
      quantity;
      paymentMethod = "COD";
      status = "pending";
      createdAt = Time.now();
    };

    preorders.add(orderId, preorder);
    orderId;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, newStatus : Text) : async () {
    switch (preorders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?existingOrder) {
        let updatedOrder : Preorder = {
          existingOrder with status = newStatus
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
