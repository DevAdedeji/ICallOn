import * as React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string,
    error?: string,
    ringColor?: string,
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ringColor, error, ...props }, ref) => {
    const inputId = React.useId();

    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type

    const baseStyles = "w-full h-full rounded-[5px] outline-none py-3.5 px-4 mx-auto  rounded-full text-sm";
    let dynamicRingStyles = "border border-white/10 focus:ring ring-primary focus:ring-2";
    if (error) {
        dynamicRingStyles = "ring ring-red-500 focus:ring-2 focus:ring-red-500";
    } else if (ringColor) {
        dynamicRingStyles = `ring focus:ring-2 ${ringColor}`;
    }
    const inputStyles = `${baseStyles} ${dynamicRingStyles}`;
    return (
        <div className={className + " relative"}>
            <input type={inputType} id={inputId} className={inputStyles} ref={ref} autoComplete="off" {...props} />
            {
                type === 'password' && (
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 text-charcoal-65 pr-3" aria-label={showPassword ? "Hide Password" : "Show Password"}>
                        {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                )
            }
            {
                error && (
                    <p className="mt-1 text-xs text-red-500">
                        {error}
                    </p>
                )
            }
        </div>
    )
})

Input.displayName = "Input";

export default Input