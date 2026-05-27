import { ScheduleStatus } from "@/lib/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertCircle, Contrast } from "lucide-react";

interface ScheduleStatusBadgeProps {
  status: ScheduleStatus;
}

export function ScheduleStatusBadge({ status }: ScheduleStatusBadgeProps) {
  switch (status) {
    case ScheduleStatus.PENDING:
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 w-[100px] justify-center">
          <Clock className="w-3 h-3 mr-1" />
          À payer
        </Badge>
      );
    case ScheduleStatus.PARTIAL:
      return (
        <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 w-[100px] justify-center">
          <Contrast className="w-3 h-3 mr-1" />
          Partiel
        </Badge>
      );
    case ScheduleStatus.PAID:
      return (
        <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 w-[100px] justify-center">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Payé
        </Badge>
      );
    case ScheduleStatus.OVERDUE:
      return (
        <Badge variant="outline" className="bg-rose-100 text-rose-700 border-rose-200 w-[100px] justify-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          En retard
        </Badge>
      );
    default:
      return null;
  }
}
