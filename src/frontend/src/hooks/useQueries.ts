import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useGetTotalPreorders() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalPreorders"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalPreorders();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useGetAllPreorders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allPreorders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPreorders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitPreorder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      quantity,
    }: {
      name: string;
      email: string;
      quantity: number;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.submitPreorder(name, email, BigInt(quantity));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["totalPreorders"] });
      queryClient.invalidateQueries({ queryKey: ["allPreorders"] });
    },
  });
}
