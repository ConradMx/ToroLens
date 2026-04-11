type PageHeaderProps = {
  title: string;
  description: string;
};

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
     <div className="space-y-5">
     
        <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text- sm:text-5xl">
          {title}
        </h1>
          <p className="font-bold text-[32px] leading-[110%] text-center mb-6 font-['Orbitron'] bg-linear-to-r from-[#041A1F] from-45% to-[#20475A] bg-clip-text text-transparent">
          {description}
        </p>
      </div>
    </div>
  );
}