using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FitnessScheduling.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessScheduling.Data
{
    public class AppointmentRepository
    {
        private FsDataContext _fsDataContext;
        public AppointmentRepository(FsDataContext fsDataContext)
        {
            _fsDataContext = fsDataContext;
        }

        public Appointment GetAppointment(Guid id)
        {
            var appointment = _fsDataContext.Appointments.FirstOrDefault(c => c.Id == id);

            return appointment;
        }

        public Appointment AddAppointmentAsync(Appointment appointment, Guid userId)
        {
            var user = _fsDataContext.Users.Include(c=>c.Place).FirstOrDefault(c => c.Id == userId);
            if (user == null)
            {
                return null;
            }

            appointment.ApplicationDate = DateTime.Now;
            appointment.User = user;
            appointment.Place = user.Place;

            var _appointment = _fsDataContext.Appointments.Add(appointment);
            var result = _fsDataContext.SaveChanges();
            if (result == 1)
            {
                return appointment;
            }
            
            return null;
        }

        public IQueryable<Appointment> GetAppointmentByPlace(Guid placeId)
        {
            var appointments = _fsDataContext.Appointments.Where(c => c.PlaceId == placeId);
            return appointments;
        }
        public IQueryable<Appointment> GetAppointmentByOwnerId(Guid id)
        {
            var place = _fsDataContext.Places.FirstOrDefault(x => x.OwnerRef == id);
            if (place == null)
            {
                return null;
            }
            var appointments = _fsDataContext.Appointments.Where(c => c.PlaceId == place.Id);
            return appointments;
        }

        public IQueryable<Appointment> GetAppointmentsByUser(Guid userId)
        {
            var appointments = _fsDataContext.Appointments.Where(c => c.UserId == userId);
            return appointments;
        }

        public Appointment RejectOrConfirmAppointment(Guid id, bool status)
        {
            var appointment = GetAppointment(id);
            if (appointment == null)
            {
                return null;
            }

            appointment.IsApproved = status;
            _fsDataContext.Entry(appointment).State = EntityState.Modified;
            _fsDataContext.SaveChanges();
            return appointment;
        }
    }
}
