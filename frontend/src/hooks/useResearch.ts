import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "../lib/api";

export function useResearch(
  id: number
) {
  return useQuery({
    queryKey: [
      "research",
      id,
    ],

    queryFn: () =>
      api.getResearch(id),

    refetchInterval: (
      query
    ) => {
      const status =
        query.state.data?.status;

      if (
        status === "pending" ||
        status === "running"
      ) {
        return 3000;
      }

      return false;
    },

    refetchIntervalInBackground: true,
  });
}


export function useResearchHistory() {
  return useQuery({
    queryKey: [
      "research-history",
    ],

    queryFn:
      api.getResearchHistory,
  });
}


export function useCreateResearch() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      api.createResearch,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "research-history",
        ],
      });
    },
  });
}


export function useDeleteResearch() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      api.deleteResearch,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "research-history",
        ],
      });
    },
  });
}