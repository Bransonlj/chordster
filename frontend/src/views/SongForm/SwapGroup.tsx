import { UseFieldArraySwap } from "react-hook-form";

interface SwapGroupProps {
    isSwapUp: boolean;
    index: number;
    swap: UseFieldArraySwap;
    length?: number
}

export default function SwapGroup({ isSwapUp=true, index, swap, length=0 }: SwapGroupProps) {

    if (isSwapUp) {
        return (
            <>
            {
                index >= 1 && <label onClick={() => swap(index, index - 1)}>Move Up</label>
            }
            </>
        )
    } else {
        return (
            <>
            {
                index < length - 1 && <label onClick={() => swap(index, index + 1)}>Move Down</label>
            }
            </>
        )
    }
}