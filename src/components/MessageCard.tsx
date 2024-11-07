import { X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

// Define a proper Message type
interface Message {
  _id: string;
  text: string;
  createdAt?: string;
}

interface MessageCardProps {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      console.log("Deleting message with ID:", message._id);
      const response = await axios.delete(`/api/delete-message/${message._id}`);

      if (response.data.success) {
        // Call the onMessageDelete callback to update the UI
        onMessageDelete(message._id);

        toast({
          title: "Success",
          description: "Message deleted successfully",
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete the message",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="relative border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 bg-gradient-to-b from-gray-800 via-gray-800 to-gray-900 hover:border-blue-500">
      <CardHeader className="flex justify-between items-center border-b border-gray-700">
        <CardTitle className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          {message.content}
        </CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-gray-400 hover:text-red-400 hover:bg-gray-800/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-gray-800 border border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-white text-lg mb-4">{message.text}</p>
        <CardDescription className="text-sm text-gray-400">
          Sent on{" "}
          {message.createdAt
            ? new Date(message.createdAt).toLocaleDateString()
            : new Date().toLocaleDateString()}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
