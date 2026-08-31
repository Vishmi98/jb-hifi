'use client';

export interface NewsItem {
    id: number;
    image: string;
    title: string;
    large?: boolean;
}

interface NewsCardProps {
    news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
    return (
        <article
            className={`bg-white border-1 shadow-[2px_2px_0_#000000] border-black flex overflow-hidden box-border ${news.large ? 'h-[150px] flex-col' : 'h-[80px] flex-row'
                }`}
        >
            <img
                src={news.image}
                alt={news.title}
                className={`object-cover block ${news.large ? 'w-full h-[110px]' : 'w-[80px] h-full'
                    }`}
            />

            <div className="flex-1 flex items-center p-[7px_9px] bg-white">
                <h3 className="m-0 text-black leading-[1.15] font-bold">
                    {news.title}
                </h3>
            </div>
        </article>
    );
}