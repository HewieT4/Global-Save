import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { GLOBAL_SAVE_ABI } from '../data/contractABI';

export function useGlobalSave(vaultAddress?: `0x${string}`) {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  
  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Read functions
  const { data: groupName } = useReadContract({
    address: vaultAddress,
    abi: GLOBAL_SAVE_ABI,
    functionName: 'groupName',
    query: { enabled: !!vaultAddress && isConnected }
  });

  const { data: totalPoolBalance } = useReadContract({
    address: vaultAddress,
    abi: GLOBAL_SAVE_ABI,
    functionName: 'totalPoolBalance',
    query: { enabled: !!vaultAddress && isConnected }
  });

  const { data: requiredSignaturesCount } = useReadContract({
    address: vaultAddress,
    abi: GLOBAL_SAVE_ABI,
    functionName: 'requiredSignaturesCount',
    query: { enabled: !!vaultAddress && isConnected }
  });

  const { data: yieldEnabled } = useReadContract({
    address: vaultAddress,
    abi: GLOBAL_SAVE_ABI,
    functionName: 'yieldEnabled',
    query: { enabled: !!vaultAddress && isConnected }
  });

  const { data: proposalCount } = useReadContract({
    address: vaultAddress,
    abi: GLOBAL_SAVE_ABI,
    functionName: 'proposalCount',
    query: { enabled: !!vaultAddress && isConnected }
  });

  // Write actions
  const contribute = async (amount: string) => {
    if (!vaultAddress) return;
    writeContract({
      address: vaultAddress,
      abi: GLOBAL_SAVE_ABI,
      functionName: 'contribute',
      args: [parseEther(amount)],
      value: parseEther(amount)
    });
  };

  const createProposal = async (title: string, description: string, amount: string, recipient: string) => {
    if (!vaultAddress) return;
    writeContract({
      address: vaultAddress,
      abi: GLOBAL_SAVE_ABI,
      functionName: 'createProposal',
      args: [title, description, parseEther(amount), recipient as `0x${string}`]
    });
  };

  const signProposal = async (proposalId: number) => {
    if (!vaultAddress) return;
    writeContract({
      address: vaultAddress,
      abi: GLOBAL_SAVE_ABI,
      functionName: 'signProposal',
      args: [BigInt(proposalId)]
    });
  };

  const vetoPayout = async (proposalId: number, reason: string) => {
    if (!vaultAddress) return;
    writeContract({
      address: vaultAddress,
      abi: GLOBAL_SAVE_ABI,
      functionName: 'vetoPayout',
      args: [BigInt(proposalId), reason]
    });
  };

  const flagProposal = async (proposalId: number, reason: string) => {
    if (!vaultAddress) return;
    writeContract({
      address: vaultAddress,
      abi: GLOBAL_SAVE_ABI,
      functionName: 'flagProposal',
      args: [BigInt(proposalId), reason]
    });
  };

  const voteDispute = async (proposalId: number, support: boolean) => {
    if (!vaultAddress) return;
    writeContract({
      address: vaultAddress,
      abi: GLOBAL_SAVE_ABI,
      functionName: 'voteDispute',
      args: [BigInt(proposalId), support]
    });
  };

  const resolveDispute = async (proposalId: number) => {
    if (!vaultAddress) return;
    writeContract({
      address: vaultAddress,
      abi: GLOBAL_SAVE_ABI,
      functionName: 'resolveDispute',
      args: [BigInt(proposalId)]
    });
  };

  const executeProposal = async (proposalId: number) => {
    if (!vaultAddress) return;
    writeContract({
      address: vaultAddress,
      abi: GLOBAL_SAVE_ABI,
      functionName: 'executeProposal',
      args: [BigInt(proposalId)]
    });
  };

  const toggleYield = async (enabled: boolean) => {
    if (!vaultAddress) return;
    writeContract({
      address: vaultAddress,
      abi: GLOBAL_SAVE_ABI,
      functionName: 'toggleYield',
      args: [enabled]
    });
  };

  return {
    isConnected,
    address,
    groupName: groupName as string | undefined,
    totalPoolBalance: totalPoolBalance ? formatEther(totalPoolBalance as bigint) : undefined,
    requiredSignaturesCount: requiredSignaturesCount ? Number(requiredSignaturesCount) : undefined,
    yieldEnabled: yieldEnabled as boolean | undefined,
    proposalCount: proposalCount ? Number(proposalCount) : undefined,
    writeTxHash: hash,
    isPending: isPending || isWaiting,
    isSuccess,
    writeError,
    
    // Actions
    contribute,
    createProposal,
    signProposal,
    vetoPayout,
    flagProposal,
    voteDispute,
    resolveDispute,
    executeProposal,
    toggleYield
  };
}
