import Image from "next/image";
import { prisma } from "@/lib/prisma";

type DrugDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function DrugDetail({ params }: DrugDetailPageProps) {
  const drug = await prisma.drug.findUnique({
    where: { id: params.id },
  });

  return (
    <div className="p-10">
      {drug?.imageUrl ? (
        <Image
          src={drug.imageUrl}
          alt={drug.name}
          width={800}
          height={420}
          className="h-auto w-full rounded-xl object-cover"
        />
      ) : null}

      <h1>{drug?.name}</h1>
      <p>{drug?.description}</p>
      <p>{drug?.usage}</p>

      <h2>Set Reminder</h2>

      {/* we build this next */}
    </div>
  );
}