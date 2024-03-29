const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({

    title: {
        type: String,
        trim: true,
        required: [true, 'please add a course title']
    },
    description: {
        type: String,
        required: [true, 'please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'please add a minimum skill'],
        enum: [`beginner`, `intermediate`, `advanced`]
    },
    scholarshipsAvailable: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

})

CourseSchema.statics.getAverageCost = async function (bootcampId) {
    console.log("Calculating avg cost...".blue);

    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId}
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition'}
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        })
    } catch (err) {
        console.error(err);
    }
}

// Call getAverageCost after save
CourseSchema.post('save', function() {
    this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre('remove', function(){
    this.constructor.getAverageCost(this.bootcamp);
})
module.exports = mongoose.model('Course', CourseSchema);