import Image from "next/image";

export function FilmTrailer() {
    return (
        <section className="w-full bg-[#FDF9F2] pt-[60px] md:pt-[100px] flex flex-col items-center">
            <h2 className="font-sans font-normal text-[24px] md:text-[30px] leading-[36px] tracking-[2.08px] text-[#E50914] uppercase mb-[40px]">
                Movie Trailer
            </h2>

            <div className="w-full max-w-[1240px] px-6 md:px-[60px] lg:px-[80px]">
                <div className="relative w-full aspect-video bg-[#F9F9F9] border border-black/5 group cursor-pointer overflow-hidden rounded-[2px] shadow-sm">
                    <Image
                        src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1200&auto=format&fit=crop"
                        alt="Trailer Thumbnail"
                        fill
                        className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-[800ms]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[80px] h-[80px] bg-black/20 backdrop-blur-[6px] rounded-[12px] flex items-center justify-center transition-transform group-hover:scale-110">
                            {/* White Play Icon */}
                            <div className="w-0 h-0 border-t-[10.5px] border-t-transparent border-l-[16.5px] border-l-white border-b-[10.5px] border-b-transparent ml-1" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
