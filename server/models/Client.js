import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Please provide client name'],
    trim: true,
    maxlength: [100, 'Client name cannot be more than 100 characters']
  },
  companyName: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Please provide mobile number'],
    trim: true
  },
  paymentReceivedDate: {
    type: Date,
    required: [true, 'Please provide payment received date']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide amount']
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide employee ID']
  },
  employeeName: {
    type: String,
    required: [true, 'Please provide employee name']
  },
  gstNumber: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email'
    ]
  },
  serviceName: {
    type: String,
    required: [true, 'Please provide service name'],
    trim: true
  },
  serviceType: {
    type: String,
    enum: ['new sale', 'upsale'],
    required: [true, 'Please specify if this is a new sale or upsale']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
clientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Client = mongoose.model('Client', clientSchema);

export default Client;