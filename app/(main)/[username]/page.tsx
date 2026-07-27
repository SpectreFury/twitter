import ProfileSection from "./_components/ProfileSection";
import TopBar from "./_components/TopBar";

const Profile = () => {
  return (
    <div className="flex flex-col">
      <TopBar />
      <ProfileSection />
    </div>
  );
};

export default Profile;
