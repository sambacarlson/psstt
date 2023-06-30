import DB from "lib/db";
import { getSession } from "next-auth/react";
import DailyCheck from 'modals/DailyChecks'

export default async function tag(req, res) {
    await DB();
    const session = await getSession({ req });

    if (!session) return res.status(401).send("Login first!");

    const dailyCheckId = session.dailyCheckId;

    const dailyCheckUpdated = await DailyCheck.findByIdAndUpdate(dailyCheckId, { logoutTime: new Date() })
    res.send("OK")
}