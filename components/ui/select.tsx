import * as React from "react";
import { cn } from "@/lib/utils";
import { useOnClickOutside } from "usehooks-ts";

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options?: { label: string; value: string | number }[];
  wrapperClassName?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, wrapperClassName, label, children, value, defaultValue, onChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const selectRef = React.useRef<HTMLSelectElement | null>(null);

    useOnClickOutside(containerRef as any, () => setIsOpen(false));

    // Uncontrolled state fallback
    const [internalValue, setInternalValue] = React.useState(
      defaultValue !== undefined ? defaultValue : (options?.[0]?.value ?? "")
    );
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    // Merge refs
    const setRefs = React.useCallback(
      (node: HTMLSelectElement) => {
        selectRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLSelectElement | null>).current = node;
        }
      },
      [ref]
    );

    const handleOptionClick = (optValue: string | number) => {
      const newValueStr = String(optValue);
      if (!isControlled) {
        setInternalValue(newValueStr);
      }

      if (selectRef.current) {
        selectRef.current.value = newValueStr;
        const event = new Event("change", { bubbles: true });

        if (onChange) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value")?.set;
          nativeInputValueSetter?.call(selectRef.current, newValueStr);

          const syntheticEvent = {
            target: selectRef.current,
            currentTarget: selectRef.current,
            preventDefault: () => {},
            stopPropagation: () => {},
          } as unknown as React.ChangeEvent<HTMLSelectElement>;
          
          onChange(syntheticEvent);
        } else {
          selectRef.current.dispatchEvent(event);
        }
      }
      setIsOpen(false);
    };

    // Determine currently selected label for display
    let displayLabel = String(currentValue);
    if (options) {
      const selectedOpt = options.find((o) => String(o.value) === String(currentValue));
      if (selectedOpt) displayLabel = selectedOpt.label;
    }

    const wrapperStyle = cn(
      "group relative flex items-center bg-surface border border-outline-variant hover:border-primary/60 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors h-14 min-w-[160px] w-full cursor-pointer",
      wrapperClassName
    );

    const customSelectElement = (
      <div
        ref={containerRef}
        className={cn("relative flex-1 flex items-center w-full h-full outline-none", props.disabled && "opacity-50 cursor-not-allowed")}
        onClick={() => !props.disabled && setIsOpen(!isOpen)}
        tabIndex={props.disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (props.disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          } else if (e.key === "Escape") {
            setIsOpen(false);
          }
        }}
      >
        <select
          ref={setRefs}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          className="sr-only"
          tabIndex={-1}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={String(opt.value)} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <div className={cn("w-full h-full flex items-center pl-4 pr-12 text-body-md font-medium text-on-surface", className)}>
          <span className="truncate">{displayLabel || "Sélectionner..."}</span>
        </div>

        <span className="absolute right-4 pointer-events-none text-on-surface-variant flex items-center justify-center transition-transform duration-200 group-hover:text-primary">
          <span className={cn("material-symbols-outlined text-xl select-none transition-transform duration-200", isOpen && "rotate-180")} data-icon="expand_more">
            expand_more
          </span>
        </span>

        {isOpen && options && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-outline-variant shadow-md z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 py-1">
            {options.map((opt) => {
              const isSelected = String(opt.value) === String(currentValue);
              return (
                <div
                  key={String(opt.value)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionClick(opt.value);
                  }}
                  className={cn(
                    "px-4 py-3 text-body-md font-medium cursor-pointer transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface hover:bg-surface-variant/50 hover:text-primary"
                  )}
                >
                  {opt.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );

    if (label) {
      return (
        <div className={wrapperStyle}>
          <span className="text-label-caps font-bold text-on-surface-variant uppercase ml-3 shrink-0 select-none tracking-wide">
            {label}
          </span>
          {customSelectElement}
        </div>
      );
    }

    return <div className={wrapperStyle}>{customSelectElement}</div>;
  }
);
Select.displayName = "Select";

export { Select };
