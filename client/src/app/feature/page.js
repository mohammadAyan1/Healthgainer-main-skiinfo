import Image from 'next/image';
import SupplementFeature from '@/pagesName/SupplementFeature';

const SupplementFeaturee = () => {
  return (
    <SupplementFeature/>
  );
};

const FeatureCard = ({ title }) => {
  return (
    <div className="flex items-center bg-white text-black shadow-lg rounded-lg p-4 max-w-md">
      <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full mr-4">
        <Image src="/2.png" width={40} height={40} alt="Icon" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">
          There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.
        </p>
      </div>
    </div>
  );
};

export default SupplementFeaturee;
