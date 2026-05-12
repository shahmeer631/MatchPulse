interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({ size = "md", text, fullPage = false }: LoadingSpinnerProps) {
  const sizes = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <div className={`${sizes[size]} rounded-full border-2 border-dark-600`}/>
        <div className={`${sizes[size]} rounded-full border-2 border-transparent border-t-brand-500 animate-spin absolute inset-0`}/>
      </div>
      {text && <p className="text-sm text-slate-500 animate-pulse">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        {spinner}
      </div>
    );
  }

  return spinner;
}
