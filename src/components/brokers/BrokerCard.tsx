// components/brokers/BrokerCard.tsx
import Link from "next/link";
import Image from "next/image";

type Broker = {
  profile_slug: string;
  name: string;
  credentials?: string | null;
  company: string;
  tagline?: string | null;
  profile_photo_url?: string | null;
  license_number?: string | null;
  languages: string[];
  areas_served: string[]; // CA counties
};

export default function BrokerCard({ broker }: { broker: Broker }) {
  return (
    <Link
      href={`/brokers/${broker.profile_slug}`}
      className="block rounded-2xl border border-[#1e2d45] bg-[#111827] p-6 transition hover:border-cyan-400"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex gap-5">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#0a0f1e]">
            {broker.profile_photo_url ? (
              <Image
                src={broker.profile_photo_url}
                alt={broker.name}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-600">
                {broker.name.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">
              {broker.name}
              {broker.credentials && (
                <span className="ml-1 text-base font-normal text-slate-400">
                  , {broker.credentials}
                </span>
              )}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-400">{broker.company}</p>
            {broker.tagline && <p className="mt-2 text-slate-300">{broker.tagline}</p>}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            window.location.href = `/brokers/${broker.profile_slug}#contact`;
          }}
          className="shrink-0 whitespace-nowrap rounded-xl bg-cyan-400 px-6 py-3 font-bold text-[#0a0f1e] hover:bg-cyan-300 transition"
        >
          Contact Broker
        </button>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {broker.languages?.length > 1 && <Badge icon="lang">Multiple Languages</Badge>}
        {broker.areas_served?.length > 0 && (
          <Badge icon="pin">
            Serving {broker.areas_served[0]}
            {broker.areas_served.length > 1 ? ` +${broker.areas_served.length - 1} more` : ""}
          </Badge>
        )}
      </div>
    </Link>
  );
}

function Badge({ children, icon }: { children: React.ReactNode; icon: "lang" | "pin" }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0a0f1e] border border-[#1e2d45] px-3 py-1.5 text-sm text-slate-300">
      {icon === "lang" && "文A"}
      {icon === "pin" && "📍"}
      {children}
    </span>
  );
}