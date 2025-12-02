import LocalizedClientLink from "@/components/Meduse/localized-client-link";

const Banners = () => {
  return (
    <div className="xl:max-w-[322px] w-full">
      <div className="flex flex-row sm:flex-row xl:flex-col gap-3">
        <div className="w-full relative rounded-[10px] overflow-hidden">
          <img
            src="/banners/new/1.png"
            alt="hero"
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="w-full relative rounded-[10px] overflow-hidden">
          <LocalizedClientLink href="/page/hakkimizda">
            <img
              src="/banners/new/2.png"
              alt="hero"
              className="w-full h-auto object-cover"
            />
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  );
};

export default Banners;
