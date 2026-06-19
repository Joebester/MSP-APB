export function PageContainer({ children, className = '' }) {
  return (
    <div className={`mx-auto flex min-h-[calc(100dvh-56px)] w-full max-w-lg flex-col bg-white ${className}`}>
      {children}
    </div>
  );
}
