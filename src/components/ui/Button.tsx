import * as React from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";

type ButtonBaseProps = {
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "outline";
    loading?: boolean;
}

type ButtonAsButton = ButtonBaseProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & { href?: never }

type ButtonAsLink = ButtonBaseProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & { href?: string }

type ButtonProps = ButtonAsButton | ButtonAsLink;

const getVariantStyles = (variant: ButtonProps['variant']) => {
    switch (variant) {
        case "primary":
            return "w-full bg-primary hover:bg-[#3bd10f] text-[#131811] font-bold rounded-full py-3.5 text-base shadow-[0_0_20px_rgba(70,236,19,0.3)] hover:shadow-[0_0_30px_rgba(70,236,19,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        case "secondary":
            return "flex items-center justify-center gap-2 rounded-full bg-white text-background-dark hover:bg-gray-100 text-lg font-bold h-14 px-10 transition-transform transform hover:scale-105 shadow-xl"
        case "outline":
            return "w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-full py-3.5 transition-all flex items-center justify-center gap-3"
        default:
            return "bg-sky-blue text-white"
    }
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(({ className, loading, children, variant = "primary", ...props }, ref) => {
    const baseStyles = "flex items-center justify-center gap-2 px-8 whitespace-nowrap";
    const variantStyles = getVariantStyles(variant);
    const combinedStyles = `${baseStyles} ${variantStyles} ${className || ''}`;
    if ("href" in props && props.href) {
        return (
            <Link className={combinedStyles} href={props.href} ref={ref as React.Ref<HTMLAnchorElement>} {...(props as Omit<ButtonAsLink, "className">)}>
                {children}
            </Link>
        )
    }
    return (
        <button className={combinedStyles} ref={ref as React.Ref<HTMLButtonElement>} {...(props as Omit<ButtonAsButton, "className">)}>
            {
                loading &&
                <LoaderCircle className="animate-spin" />
            }
            {children}
        </button>
    )
})

Button.displayName = "Button";

export default Button;