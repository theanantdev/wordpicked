export default function MaxWidthWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-auto w-full max-w-80 px-1 py-5 min-[360px]:max-w-90 min-[480px]:max-w-120 min-[640px]:max-w-160 min-[768px]:max-w-3xl min-[1024px]:max-w-5xl min-[1200px]:max-w-300 min-[1440px]:max-w-360 min-[1920px]:max-w-420 min-[768px]:py-12 min-[1200px]:py-14 min-[1920px]:py-16">
            {children}
        </div>
    );
}