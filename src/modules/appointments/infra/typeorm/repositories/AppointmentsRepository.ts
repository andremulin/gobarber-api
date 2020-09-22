import Appointment from '../entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepositoy'

import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment> implements IAppointmentsRepository{
    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = await this.findOne({
            where: { date },
        });

        return findAppointment;
    }
}

export default AppointmentRepository;
