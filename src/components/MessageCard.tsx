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

type MessageCardProp = {
  message: { _id: string; text: string }; // Adjusted to reflect the actual message structure
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProp) => {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`/api/delete-message/${message._id}`);
      toast({ title: response.data.message });
      onMessageDelete(message._id);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete the message",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="relative border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg font-medium">{message}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-red-500"
            >
              <X className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="text-gray-700">{message.text}</CardContent>
      <CardDescription className="text-xs text-gray-500">
        Sent on {new Date().toLocaleDateString()}
      </CardDescription>
    </Card>
  );
};

export default MessageCard;
