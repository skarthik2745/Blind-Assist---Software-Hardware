import { User, EmergencyContact, MedicineSchedule, VoiceMessage, SOSAlert, DoctorPatientRelationship } from '../types';

class LocalStorageService {
  constructor() {
    this.seedDummyData();
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  seedDummyData(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      const usersJson = localStorage.getItem('users');
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      const johnExists = users.some(u => u.voice_login_name.toLowerCase() === 'shankar');

      if (!johnExists) {
        const dummyPatient: User = {
          id: 'patient-john',
          role: 'patient',
          full_name: 'John',
          voice_login_name: 'shankar',
          age: 65,
          gender: 'Male',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const dummyDoctor: User = {
          id: 'doctor-1',
          role: 'doctor',
          full_name: 'Dr. Sarah Smith',
          voice_login_name: 'doctor',
          hospital_contact: '+1 234 567 8900',
          specialization: 'General Physician & Geriatrics',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        users.push(dummyPatient);
        if (!users.some(u => u.id === 'doctor-1')) {
          users.push(dummyDoctor);
        }
        localStorage.setItem('users', JSON.stringify(users));

        // Seed Doctor-Patient Relationship
        const relsJson = localStorage.getItem('doctorPatientRelationships');
        const relationships: DoctorPatientRelationship[] = relsJson ? JSON.parse(relsJson) : [];
        if (!relationships.some(r => r.patient_id === 'patient-john')) {
          relationships.push({
            id: 'rel-1',
            doctor_id: 'doctor-1',
            patient_id: 'patient-john',
            created_at: new Date().toISOString(),
          });
          localStorage.setItem('doctorPatientRelationships', JSON.stringify(relationships));
        }

        // Seed Health Card for John
        const healthCardKey = 'healthCard_patient-john';
        if (!localStorage.getItem(healthCardKey)) {
          const dummyHealthCard = {
            fullName: 'John',
            age: '65',
            gender: 'Male',
            bloodGroup: 'O+',
            height: '172',
            weight: '70',
            knownDiseases: 'Mild Hypertension, Partial Visual Impairment',
            allergies: 'Penicillin, Peanuts',
            currentSymptoms: 'Mild morning dizziness, dry eyes',
            currentMedications: 'Amlodipine 5mg, Latanoprost Eye Drops',
            pastMedicalHistory: 'Cataract surgery (2021)',
            diagnosisSummary: 'Patient is visually impaired with well-managed blood pressure.',
            specialInstructions: 'Voice reminders and emergency hardware buttons active.'
          };
          localStorage.setItem(healthCardKey, JSON.stringify(dummyHealthCard));
        }

        // Seed Emergency Contacts for John
        const contactsJson = localStorage.getItem('emergencyContacts');
        const contacts: EmergencyContact[] = contactsJson ? JSON.parse(contactsJson) : [];
        if (!contacts.some(c => c.patient_id === 'patient-john')) {
          contacts.push(
            {
              id: 'contact-1',
              patient_id: 'patient-john',
              contact_name: 'Mary (Daughter)',
              phone_number: '+1 555-0199',
              relationship: 'Daughter',
              created_at: new Date().toISOString(),
            },
            {
              id: 'contact-2',
              patient_id: 'patient-john',
              contact_name: 'Robert (Caretaker)',
              phone_number: '+1 555-0248',
              relationship: 'Caregiver',
              created_at: new Date().toISOString(),
            }
          );
          localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
        }

        // Seed Medicine Schedule for John
        const medsJson = localStorage.getItem('medicineSchedules');
        const medicines: MedicineSchedule[] = medsJson ? JSON.parse(medsJson) : [];
        if (!medicines.some(m => m.patient_id === 'patient-john')) {
          medicines.push(
            {
              id: 'med-1',
              patient_id: 'patient-john',
              medicine_name: 'Amlodipine',
              dosage: '5mg',
              scheduled_time: '09:00:00',
              frequency: 'Daily',
              instructions: 'After Food',
              active: true,
              created_at: new Date().toISOString(),
            },
            {
              id: 'med-2',
              patient_id: 'patient-john',
              medicine_name: 'Latanoprost Eye Drops',
              dosage: '1 drop',
              scheduled_time: '14:00:00',
              frequency: 'Daily',
              instructions: 'After Food',
              active: true,
              created_at: new Date().toISOString(),
            },
            {
              id: 'med-3',
              patient_id: 'patient-john',
              medicine_name: 'Multivitamin & Calcium',
              dosage: '1 tablet',
              scheduled_time: '21:00:00',
              frequency: 'Daily',
              instructions: 'After Food',
              active: true,
              created_at: new Date().toISOString(),
            }
          );
          localStorage.setItem('medicineSchedules', JSON.stringify(medicines));
        }

        // Seed Voice Messages for Doctor Dashboard
        const vmJson = localStorage.getItem('voiceMessages');
        const voiceMessages: VoiceMessage[] = vmJson ? JSON.parse(vmJson) : [];
        if (!voiceMessages.some(vm => vm.patient_id === 'patient-john')) {
          voiceMessages.push(
            {
              id: 'vm-1',
              patient_id: 'patient-john',
              doctor_id: 'doctor-1',
              transcription: 'Good morning Dr. Sarah. I felt a bit dizzy when waking up today, but after taking my 9 AM medicine and breakfast, I feel much better now.',
              message_date: new Date().toISOString().split('T')[0],
              listened: false,
              created_at: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: 'vm-2',
              patient_id: 'patient-john',
              doctor_id: 'doctor-1',
              transcription: 'Hello Doctor, eye drops were administered at 2 PM as scheduled.',
              message_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
              listened: true,
              created_at: new Date(Date.now() - 86400000).toISOString(),
            }
          );
          localStorage.setItem('voiceMessages', JSON.stringify(voiceMessages));
        }

        // Seed SOS Alerts for Doctor Dashboard
        const sosJson = localStorage.getItem('sosAlerts');
        const alerts: SOSAlert[] = sosJson ? JSON.parse(sosJson) : [];
        if (!alerts.some(a => a.patient_id === 'patient-john')) {
          alerts.push({
            id: 'sos-1',
            patient_id: 'patient-john',
            alert_type: 'single',
            latitude: 37.7749,
            longitude: -122.4194,
            status: 'resolved',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            resolved_at: new Date(Date.now() - 82800000).toISOString(),
          });
          localStorage.setItem('sosAlerts', JSON.stringify(alerts));
        }
      }
    } catch (e) {
      console.error('Error seeding dummy data:', e);
    }
  }

  // Users
  getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem('users', JSON.stringify(users));
  }

  getUserByVoiceName(voiceName: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.voice_login_name.toLowerCase() === voiceName.toLowerCase()) || null;
  }

  getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  getDoctors(): User[] {
    return this.getUsers().filter(u => u.role === 'doctor');
  }

  // Current user session
  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  clearCurrentUser(): void {
    localStorage.removeItem('currentUser');
  }

  // Emergency Contacts
  getEmergencyContacts(): EmergencyContact[] {
    const contacts = localStorage.getItem('emergencyContacts');
    return contacts ? JSON.parse(contacts) : [];
  }

  saveEmergencyContact(contact: Omit<EmergencyContact, 'id' | 'created_at'>): EmergencyContact {
    const contacts = this.getEmergencyContacts();
    const newContact: EmergencyContact = {
      ...contact,
      id: this.generateId(),
      created_at: new Date().toISOString()
    };
    contacts.push(newContact);
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
    return newContact;
  }

  getEmergencyContactsByPatientId(patientId: string): EmergencyContact[] {
    return this.getEmergencyContacts().filter(c => c.patient_id === patientId);
  }

  // Medicine Schedules
  getMedicineSchedules(): MedicineSchedule[] {
    const schedules = localStorage.getItem('medicineSchedules');
    return schedules ? JSON.parse(schedules) : [];
  }

  saveMedicineSchedule(schedule: Omit<MedicineSchedule, 'id' | 'created_at'>): MedicineSchedule {
    const schedules = this.getMedicineSchedules();
    const newSchedule: MedicineSchedule = {
      ...schedule,
      id: this.generateId(),
      created_at: new Date().toISOString()
    };
    schedules.push(newSchedule);
    localStorage.setItem('medicineSchedules', JSON.stringify(schedules));
    return newSchedule;
  }

  getMedicineSchedulesByPatientId(patientId: string): MedicineSchedule[] {
    return this.getMedicineSchedules().filter(s => s.patient_id === patientId && s.active);
  }

  // Voice Messages
  getVoiceMessages(): VoiceMessage[] {
    const messages = localStorage.getItem('voiceMessages');
    return messages ? JSON.parse(messages) : [];
  }

  saveVoiceMessage(message: Omit<VoiceMessage, 'id' | 'created_at'>): VoiceMessage {
    const messages = this.getVoiceMessages();
    const newMessage: VoiceMessage = {
      ...message,
      id: this.generateId(),
      created_at: new Date().toISOString()
    };
    messages.push(newMessage);
    localStorage.setItem('voiceMessages', JSON.stringify(messages));
    return newMessage;
  }

  getVoiceMessagesByDoctorId(doctorId: string): VoiceMessage[] {
    return this.getVoiceMessages().filter(m => m.doctor_id === doctorId);
  }

  // SOS Alerts
  getSOSAlerts(): SOSAlert[] {
    const alerts = localStorage.getItem('sosAlerts');
    return alerts ? JSON.parse(alerts) : [];
  }

  saveSOSAlert(alert: Omit<SOSAlert, 'id' | 'created_at'>): SOSAlert {
    const alerts = this.getSOSAlerts();
    const newAlert: SOSAlert = {
      ...alert,
      id: this.generateId(),
      created_at: new Date().toISOString()
    };
    alerts.push(newAlert);
    localStorage.setItem('sosAlerts', JSON.stringify(alerts));
    return newAlert;
  }

  updateSOSAlert(id: string, updates: Partial<SOSAlert>): void {
    const alerts = this.getSOSAlerts();
    const index = alerts.findIndex(a => a.id === id);
    if (index >= 0) {
      alerts[index] = { ...alerts[index], ...updates };
      localStorage.setItem('sosAlerts', JSON.stringify(alerts));
    }
  }

  getSOSAlertsByPatientId(patientId: string): SOSAlert[] {
    return this.getSOSAlerts().filter(a => a.patient_id === patientId);
  }

  // Doctor-Patient Relationships
  getDoctorPatientRelationships(): DoctorPatientRelationship[] {
    const relationships = localStorage.getItem('doctorPatientRelationships');
    return relationships ? JSON.parse(relationships) : [];
  }

  saveDoctorPatientRelationship(relationship: Omit<DoctorPatientRelationship, 'id' | 'created_at'>): DoctorPatientRelationship {
    const relationships = this.getDoctorPatientRelationships();
    const newRelationship: DoctorPatientRelationship = {
      ...relationship,
      id: this.generateId(),
      created_at: new Date().toISOString()
    };
    relationships.push(newRelationship);
    localStorage.setItem('doctorPatientRelationships', JSON.stringify(relationships));
    return newRelationship;
  }

  getDoctorIdByPatientId(patientId: string): string | null {
    const relationships = this.getDoctorPatientRelationships();
    const relationship = relationships.find(r => r.patient_id === patientId);
    return relationship ? relationship.doctor_id : null;
  }

  getPatientsByDoctorId(doctorId: string): string[] {
    const relationships = this.getDoctorPatientRelationships();
    return relationships.filter(r => r.doctor_id === doctorId).map(r => r.patient_id);
  }
}

export const localStorageService = new LocalStorageService();