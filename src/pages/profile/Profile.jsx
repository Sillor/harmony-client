import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { EditProfilePictureDialog } from "./EditProfilePictureDialog";
import StatusMessage from "../../components/ui/status-message";
import { ProfilePicture } from "../../components/ProfilePicture";
import { getUser, updateUser } from "../../utils/authHandler";

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState("");

  const [userData, setUserData] = useState({
    username: "",
    email: ""
  });

  const [errors, setErrors] = useState({
    username: null,
    email: null
  });

  const [serverResponse, setServerResponse] = useState({ success: null, message: "" });

  const { toast } = useToast();

  // Get user data when page loads
  useEffect(() => {
    initializeData();
  }, []);
  
  const initializeData = async () => {
    const data = await getUser();

    if (!data.success) {
      console.log(data.message);
      return;
    }

    const user = data.data;
    
    setProfilePicture(user.profileUrl);
    setUserData({
      username: user.username,
      email: user.email
    })
  }

  const handleSetProfilePicture = (value) => {
    setProfilePicture(value);
  }

  const handleOnChange = (event) => {
    setUserData(prev => ({ ...prev, [event.target.name]: event.target.value }))
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // For each 'userData' field, set the corresponding error to false if the inputData value is a truthy.
    // Else, set the error to be true.
    Object.keys(userData).forEach((field) => {
      const value = userData[field];
      setErrors((prev) => ({ ...prev, [field]: value ? false : true }));
    });
  };

  const finishSubmit = async () => {
    const data = await updateUser(userData.username, userData.email);

    if (data.success === true) {
      toast({
        description: data.message
      });
    }

    setServerResponse({ error: !data.success, message: data.message });
  }

  useEffect(() => {
    // Set 'isErrors' to true if 'errors' has at least one truthy value or one null value
    const isErrors = Object.values(errors).some(
      (error) => error === true || error === null
    );

    if (!isErrors) {
      finishSubmit();
    }
  }, [errors]);

  return (
    <div className="h-[calc(100vh-6rem)] w-[250px] sm:w-[420px] flex flex-col justify-center">
      <h1 className="text-2xl font-semibold flex justify-center mb-[34px]">
        Profile
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="grid w-full items-center gap-4">
          <div className="flex justify-center mb-[34px]">
            <div className="relative">
              {/* Profile Picture */}
              <ProfilePicture
                image={profilePicture}
                className="size-[250px]"
              />
              {/* Change Profile Picture Button */}
              <EditProfilePictureDialog
                profilePicture={profilePicture}
                handleSetProfilePicture={handleSetProfilePicture}
                avatarLink={profilePicture}
                className="absolute bottom-0 right-5"
              />
            </div>
          </div>
          {/* Username */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Username"
              defaultValue={userData.username}
              onInput={handleOnChange}
            />
            {/* Error for Username field */}
            <StatusMessage
              error={errors.username}
              message="Username field is required"
            />
          </div>
          {/* Email */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              defaultValue={userData.email}
              onInput={handleOnChange}
            />
            {/* Error for Email field */}
            <StatusMessage
              error={errors.email}
              message="Email field is required"
            />
            <StatusMessage
              error={serverResponse.error}
              message={serverResponse.message}
            />
          </div>
          {/* Update Profile Button */}
          <div className="flex mt-3">
            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </div>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default Profile;
