import { format } from "date-fns";
import { id } from "date-fns/locale";

function formatDate(date: Date | string, formatStr = "PPP") {
  return format(date, formatStr, {
    locale: id
  });
}

export default formatDate