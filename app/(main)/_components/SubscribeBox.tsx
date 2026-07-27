import { Button } from "@/components/ui/button";

const SubscribeBox = () => {
  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg">
      <div className="text-xl font-semibold">Subscribe to Premium</div>
      <div className="text-gray-700">
        Get rid of ads, see your analytics, boost your replies and unlock 20+
        features.
      </div>
      <Button className="bg-blue-500 p-4 rounded-full self-start">
        Subscribe
      </Button>
    </div>
  );
};

export default SubscribeBox;
