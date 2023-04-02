import {Request, Response, Router} from "express";
import {accessibleUserList, roleCheck} from "../util/common_util";
import validator, {ValidationFunction} from "../util/validator_util";
import ValidationError from "../dto/validation_error";
import prisma from "../service/db";
import {AttendanceType, isValidAttendanceType} from "../dto/attendance_type";
import {hasRole} from "../util/auth_util";

const attendanceRouter: Router = Router();

const validation: ValidationFunction = async (body: any): Promise<ValidationError[]> => {
    let errors: ValidationError[] = [];

    if (!body.forUser) {
        errors.push(new ValidationError('forUser', 'Invalid user'));
    }

    const users = await accessibleUserList(body.accessibleStores);

    const usersIds = users.map(user => user.id);

    if (!usersIds.includes(body.forUser)) {
        errors.push(new ValidationError('forUser', 'Invalid user'));
    }

    if (!body.attendanceDate) {
        errors.push(new ValidationError('attendanceDate', 'Attendance Date Required'));
    }

    if (!body.type || !isValidAttendanceType(body.type)) {
        errors.push(new ValidationError('type', 'Invalid attendance type'));
    }

    return new Promise<ValidationError[]>((resolve) => {
        resolve(errors);
    });
}

const leaveRequestValidation: ValidationFunction = async (body: any): Promise<ValidationError[]> => {
    let errors: ValidationError[] = [];

    if (!body.attendanceDate) {
        errors.push(new ValidationError('attendanceDate', 'Attendance Date Required'));
    }

    return new Promise<ValidationError[]>((resolve) => {
        resolve(errors);
    });
}

attendanceRouter.post('/createAttendance',
    validator(validation),
    roleCheck(['STORE_ADMIN', 'ATTENDANCE']), async (req: Request, res: Response) => {
        const body = req.body;

        const attendance = await prisma.attendacne.create({
            data: {
                createdAt: new Date(),
                user: {
                    connect: {
                        id: body.forUser
                    }
                },
                addedBy: {
                    connect: {
                        id: body.user.id
                    }
                },
                approvedBy: {
                    connect: {
                        id: body.user.id
                    }
                },
                attendanceDate: new Date(new Date(body.attendanceDate).setHours(0, 0, 0, 0)),
                deleted: false,
                type: body.type
            }
        });

        res.json(attendance)
    }
);

attendanceRouter.post('/deleteAttendance',
    roleCheck(['STORE_ADMIN', 'ATTENDANCE']), async (req: Request, res: Response) => {
        const body = req.body;

        const users = await accessibleUserList(body.accessibleStores);
        const userIdList = users.map(user => user.id);

        const attendanceFromDb = await prisma.attendacne.findFirst({
            where: {
                id: body.id,
            },
            include: {user: true}
        });

        if (!attendanceFromDb || !userIdList.includes(attendanceFromDb.user.id)) {
            res.status(401);
            res.json('Invalid attendance');
            return;
        }

        const attendance = await prisma.attendacne.update({
            where: {id: req.body.id},
            data: {
                deleted: true,
                deletedBy: {
                    connect: {
                        id: body.user.id
                    }
                },
            }
        });

        res.json(attendance)
    }
);

attendanceRouter.post('/approveAttendance',
    roleCheck(['STORE_ADMIN', 'ATTENDANCE']), async (req: Request, res: Response) => {
        const body = req.body;

        const users = await accessibleUserList(body.accessibleStores);
        const userIdList = users.map(user => user.id);

        const attendanceFromDb = await prisma.attendacne.findFirst({
            where: {
                id: body.id,
            },
            include: {user: true}
        });

        if (!attendanceFromDb || !userIdList.includes(attendanceFromDb.user.id)) {
            res.status(401);
            res.json('Invalid attendance');
            return;
        }

        const attendance = await prisma.attendacne.update({
            where: {id: req.body.id},
            data: {
                type: AttendanceType[AttendanceType.APPROVED_LEAVE],
                approvedBy: {
                    connect: {
                        id: body.user.id
                    }
                },
            }
        });

        res.json(attendance)
    }
);

attendanceRouter.post('/createLeaveRequest',
    validator(leaveRequestValidation), (req: Request, res: Response) => {
        const body = req.body;

        const attendance = prisma.attendacne.create({
            data: {
                createdAt: new Date(),
                user: {
                    connect: {
                        id: body.user.id
                    }
                },
                addedBy: {
                    connect: {
                        id: body.user.id
                    }
                },
                attendanceDate: new Date(body.attendanceDate),
                deleted: false,
                type: AttendanceType.UNAPPROVED_LEAVE.toString()
            }
        });

        res.json(attendance)
    }
);

attendanceRouter.get('/attendances/:id', async (req: Request, res: Response) => {
        const body = req.body;
        const attendanceDateFrom = req.query.attendanceDateFrom;
        const attendanceDateTo = req.query.attendanceDateTo;
        const attendanceDateType = req.query.attendanceDateType;
        const deleted = req.query.deleted;

        if (req.body.userId !== req.body.user.id) {
            if (!hasRole(req, 'ATTENDANCE') && !req.body.user.storeAdmin) {
                res.status(401);
                res.json('Invalid action');
                return;
            }
        }

        if (hasRole(req, 'ATTENDANCE') || req.body.user.storeAdmin) {
            const users = await accessibleUserList(body.accessibleStores);
            const userIdList = users.map(user => user.id);

            if (!userIdList.includes(req.params.id)) {
                res.status(401);
                res.json('Invalid action');
                return;
            }
        }

        let whereCondition: any = {
            userId: req.params.id,
        };

        if (!deleted) {
            whereCondition.deleted = false;
        }

        if (attendanceDateType != 'ALL') {
            whereCondition.type = attendanceDateType;
        }

        if (attendanceDateFrom && attendanceDateTo) {
            whereCondition.attendanceDate = {
                gte: new Date(new Date().setHours(0, 0, 0, 0)).toISOString().split("T")[0],
                lte: new Date(new Date(body.attendanceDateTo).setHours(0, 0, 0, 0)).toISOString().split("T")[0]
            }
        }

        console.log(whereCondition);

        const attendances = await prisma.attendacne.findMany({
            where: whereCondition,
            include: {user: true, addedBy: true, approvedBy: true, deletedBy: true}
        });

        attendances.forEach(attendance => {
            attendance.user.password = '';

            if (attendance.approvedBy) {
                attendance.approvedBy.password = '';
            }

            if (attendance.addedBy) {
                attendance.addedBy.password = '';
            }

            if (attendance.deletedBy) {
                attendance.deletedBy.password = '';
            }
        });

        attendances.sort((a, b) => {
            // @ts-ignore
            return new Date(b.attendanceDate) - new Date(a.attendanceDate);
        });

        res.json(attendances)
    }
);

export default attendanceRouter;
