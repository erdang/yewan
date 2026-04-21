import { APPNAME } from '@/utility/appName';

const hostname = window.location.hostname;
const appname = APPNAME[hostname].appname;
export default function setTitle(title, suffix = true) {
    if (title) {
        document.title = title;
    } else {
        document.title = appname;
    }
}
