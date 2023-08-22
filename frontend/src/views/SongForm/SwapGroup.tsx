import { UseFieldArraySwap } from "react-hook-form";
import IconButton from "../Components/IconButton";

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
                <IconButton disabled={index === 0} onClick={() => swap(index, index - 1)} src="/up-arrow-icon.png"></IconButton>
            </>
        )
    } else {
        return (
            <>
                <IconButton disabled={index >= length - 1} onClick={() => swap(index, index + 1)} src="/down-arrow-icon.png"></IconButton>
            </>
        )
    }
}