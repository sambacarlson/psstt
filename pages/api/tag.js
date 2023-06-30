import User from "modals/User";
import Timer from 'modals/Timers'
import DB from "lib/db";
import { getSession } from "next-auth/react";

export default async function tag(req, res) {
  await DB();
  const session = await getSession({ req });

  // if (!session) return res.status(401).send("Login first!");

  // const userId = session.user._id;
  // if (req.method === "POST") {

  if (req.query?.id) {
    console.log('request parameters: ', req.query?.id)

    console.log('task to be updated: ', req.body.updatedTask)
    const taskUpdated = await Timer.findByIdAndUpdate(req.query?.id, req.body.updatedTask)
    console.log('task updated: ', taskUpdated)
    res.send(taskUpdated)
  }
  else {
    console.log('request when creating timer: ', req)
    const task = new Timer(req.body.task)
    const taskCreated = await task.save()

    console.log('task created: ', taskCreated)

    res.send(taskCreated);
  }
  // } else {
  //   const tags = await User.findOne({ _id: userId }, { tags: 1 }).then(
  //     (user) => user.tags
  //   );
  //   res.send(tags);
  // }
}
