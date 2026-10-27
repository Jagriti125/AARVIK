require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const HazardReport = require('../models/HazardReport');
const RiskRecord = require('../models/RiskRecord');
const Alert = require('../models/Alert');

const seedData = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aarvik';

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[AARVIK Seed] Connected to MongoDB.');

    // Clear existing demonstration data if requested, or keep it fresh
    await Promise.all([
      HazardReport.deleteMany({}),
      RiskRecord.deleteMany({}),
      Alert.deleteMany({}),
    ]);
    console.log('[AARVIK Seed] Cleared existing records.');

    // 1. Create Default Admin if not exists
    let admin = await Admin.findOne({ email: 'admin@aarvik.org' });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('AarvikAdmin#2026', salt);
      admin = await Admin.create({
        name: 'AARVIK Lead Officer',
        email: 'admin@aarvik.org',
        passwordHash,
        role: 'admin',
      });
      console.log('[AARVIK Seed] Default admin created: admin@aarvik.org / AarvikAdmin#2026');
    }

    // 2. Demonstration Risk Monitoring Records
    // Clearly marked as 'Demonstration data'
    const demoRiskRecords = [
      {
        locationName: 'Joshimath Upper Slope Zone B',
        state: 'Uttarakhand',
        district: 'Chamoli',
        latitude: 30.5564,
        longitude: 79.5638,
        rainfall: 142.5,
        riskLevel: 'Critical',
        monitoringStatus: 'Active',
        remarks: 'Significant ground deformation documented in past surveys. High saturation recorded during recent simulated monsoon pass.',
        dataSource: 'Demonstration data',
        recordedAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        locationName: 'Rudraprayag Bypass Junction Km 14',
        state: 'Uttarakhand',
        district: 'Rudraprayag',
        latitude: 30.2858,
        longitude: 78.9811,
        rainfall: 88.0,
        riskLevel: 'High',
        monitoringStatus: 'Active',
        remarks: 'Active debris flow zone. Catchment drainage shows accumulated silt and loose rock fragments.',
        dataSource: 'Demonstration data',
        recordedAt: new Date(Date.now() - 5 * 3600 * 1000),
      },
      {
        locationName: 'Mandi-Pandoh Highway Gorge',
        state: 'Himachal Pradesh',
        district: 'Mandi',
        latitude: 31.6702,
        longitude: 76.9944,
        rainfall: 110.2,
        riskLevel: 'Critical',
        monitoringStatus: 'Active',
        remarks: 'Steep road cutting prone to frequent rockfall and unstable overhangs along river gorge.',
        dataSource: 'Demonstration data',
        recordedAt: new Date(Date.now() - 8 * 3600 * 1000),
      },
      {
        locationName: 'Dharamsala McLeod Ganj Ridge',
        state: 'Himachal Pradesh',
        district: 'Kangra',
        latitude: 32.2426,
        longitude: 76.3213,
        rainfall: 62.4,
        riskLevel: 'Moderate',
        monitoringStatus: 'Active',
        remarks: 'Perched clay layers on dip slope. Moderate precipitation observed over last 48 hours.',
        dataSource: 'Demonstration data',
        recordedAt: new Date(Date.now() - 12 * 3600 * 1000),
      },
      {
        locationName: 'Meppadi Chooralmala Sector',
        state: 'Kerala',
        district: 'Wayanad',
        latitude: 11.5512,
        longitude: 76.1302,
        rainfall: 168.0,
        riskLevel: 'Critical',
        monitoringStatus: 'Active',
        remarks: 'Historically vulnerable tea plantation slope. High pore-water pressure suspected following sustained rainfall.',
        dataSource: 'Demonstration data',
        recordedAt: new Date(Date.now() - 15 * 3600 * 1000),
      },
      {
        locationName: 'Munnar Gap Road Stretch',
        state: 'Kerala',
        district: 'Idukki',
        latitude: 10.0889,
        longitude: 77.0595,
        rainfall: 45.0,
        riskLevel: 'Moderate',
        monitoringStatus: 'Active',
        remarks: 'Past slope stabilization wire mesh in place. Small rock gravel observed on shoulder.',
        dataSource: 'Demonstration data',
        recordedAt: new Date(Date.now() - 20 * 3600 * 1000),
      },
      {
        locationName: 'Pithoragarh Dharchula Valley',
        state: 'Uttarakhand',
        district: 'Pithoragarh',
        latitude: 29.8458,
        longitude: 80.5372,
        rainfall: 74.5,
        riskLevel: 'High',
        monitoringStatus: 'Active',
        remarks: 'Narrow valley with steep talus cones. Runoff streams carrying substantial sediment load.',
        dataSource: 'Demonstration data',
        recordedAt: new Date(Date.now() - 24 * 3600 * 1000),
      },
      {
        locationName: 'Gangtok 9th Mile Hillside',
        state: 'Sikkim',
        district: 'Gangtok',
        latitude: 27.3389,
        longitude: 88.6065,
        rainfall: 32.0,
        riskLevel: 'Low',
        monitoringStatus: 'Active',
        remarks: 'Retaining walls functioning normally. Normal runoff through masonry drains.',
        dataSource: 'Demonstration data',
        recordedAt: new Date(Date.now() - 28 * 3600 * 1000),
      },
      {
        locationName: 'Kullu Manali Left Bank Road',
        state: 'Himachal Pradesh',
        district: 'Kullu',
        latitude: 32.0998,
        longitude: 77.1753,
        rainfall: 28.5,
        riskLevel: 'Low',
        monitoringStatus: 'Active',
        remarks: 'River bank toe erosion monitoring point. Surface dry with minor seepage.',
        dataSource: 'Demonstration data',
        recordedAt: new Date(Date.now() - 36 * 3600 * 1000),
      },
      {
        locationName: 'Nainital Upper Mall Hill Cut',
        state: 'Uttarakhand',
        district: 'Nainital',
        latitude: 29.3919,
        longitude: 79.4542,
        rainfall: 55.0,
        riskLevel: 'Moderate',
        monitoringStatus: 'Active',
        remarks: 'Limestone scree slope monitoring station. Routine inspections logged.',
        dataSource: 'Demonstration data',
        recordedAt: new Date(Date.now() - 48 * 3600 * 1000),
      },
    ];

    await RiskRecord.insertMany(demoRiskRecords);
    console.log(`[AARVIK Seed] Inserted ${demoRiskRecords.length} demonstration risk records.`);

    // 3. Demonstration Hazard Reports
    const demoHazardReports = [
      {
        title: 'Fresh longitudinal crack across NH-58 shoulder',
        reporterName: 'Vikram Singh Rawat',
        reporterEmail: 'vikram.rawat@field-observer.org',
        state: 'Uttarakhand',
        district: 'Chamoli',
        location: 'Near Helang Village, NH-58 Km 18',
        latitude: 30.5284,
        longitude: 79.5218,
        hazardType: 'Visible ground cracks',
        description: 'Observed a 15-meter long tension crack opening along the downhill pavement edge. Width is approximately 3 inches and appears to have widened following overnight rainfall.',
        observedConditions: 'Wet saturated soil with ongoing muddy trickle emerging from below the asphalt.',
        rainfall: 95.0,
        imageUrl: 'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&w=800&q=80',
        observedAt: new Date(Date.now() - 4 * 3600 * 1000),
        status: 'Verified',
        adminNotes: 'Verified on-site by District Highway Engineering squad. Traffic restricted to single lane.',
      },
      {
        title: 'Intermittent rock boulders tumbling onto lower approach road',
        reporterName: 'Priya Sharma',
        reporterEmail: 'priya.sharma@naturetrails.in',
        state: 'Himachal Pradesh',
        district: 'Mandi',
        location: 'Pandoh Dam approach road, Sector 3',
        latitude: 31.6734,
        longitude: 77.0012,
        hazardType: 'Rockfall',
        description: 'Small to medium fist-sized rocks and two larger boulders rolled down the unprotected slope above the bend. Drivers are slowing down abruptly.',
        observedConditions: 'Dry loose scree on 60-degree weathered shale slope.',
        rainfall: 12.0,
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        observedAt: new Date(Date.now() - 7 * 3600 * 1000),
        status: 'Under Review',
        adminNotes: 'Inspection scheduled with Public Works Department road safety crew.',
      },
      {
        title: 'Mud slurry and sudden muddy water surge in natural gully',
        reporterName: 'George Kurian',
        reporterEmail: 'gkurian.estate@plantation.in',
        state: 'Kerala',
        district: 'Wayanad',
        location: 'Vellarimala foothills near stream crossing',
        latitude: 11.5321,
        longitude: 76.1189,
        hazardType: 'Unusual water flow',
        description: 'A previously clear mountain stream turned violently brown and thick with red mud at 10 AM without immediate cloudburst overhead, hinting at soil failure higher up.',
        observedConditions: 'Murky churning water carrying branches and mud clumps.',
        rainfall: 140.0,
        imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
        observedAt: new Date(Date.now() - 10 * 3600 * 1000),
        status: 'Verified',
        adminNotes: 'Upstream survey initiated. Downstream families notified via Gram Panchayat.',
      },
      {
        title: 'Subsidence and tilted fence posts along residential terracing',
        reporterName: 'Devendra Bhatt',
        reporterEmail: 'devendra.bhatt@gmail.com',
        state: 'Uttarakhand',
        district: 'Nainital',
        location: 'Ayarpatta Hill residential lane 4',
        latitude: 29.3855,
        longitude: 79.4621,
        hazardType: 'Slope movement',
        description: 'Retaining boundary wall exhibits a 5-degree outward tilt and small fissures on garden terrace. Trees leaning downhill.',
        observedConditions: 'Moist gravelly fill behind old rubble masonry retaining wall.',
        rainfall: 45.0,
        imageUrl: '',
        observedAt: new Date(Date.now() - 22 * 3600 * 1000),
        status: 'Pending Review',
        adminNotes: '',
      },
      {
        title: 'Road subsidence and culvert collapse after heavy downpour',
        reporterName: 'Anand Kumar',
        reporterEmail: 'anand.k@translogistics.in',
        state: 'Himachal Pradesh',
        district: 'Shimla',
        location: 'Theog-Kotkhai link route Km 9',
        latitude: 31.1215,
        longitude: 77.3512,
        hazardType: 'Road damage',
        description: 'Underlying culvert gave way, leaving a half-meter void under the paved carriage. High risk for heavy trucks at night.',
        observedConditions: 'Continuous water seepage scouring sub-base foundation.',
        rainfall: 78.0,
        imageUrl: '',
        observedAt: new Date(Date.now() - 30 * 3600 * 1000),
        status: 'Resolved',
        adminNotes: 'Repaired by state highway division with reinforced concrete box culvert.',
      },
      {
        title: 'Erroneous report of slide near city shopping complex',
        reporterName: 'Anonymous Caller',
        reporterEmail: 'citizen.caller@mail.com',
        state: 'Uttarakhand',
        district: 'Dehradun',
        location: 'Rajpur Road City Center',
        latitude: 30.3341,
        longitude: 78.0512,
        hazardType: 'Other',
        description: 'Reported construction ditch excavation as active landslide.',
        observedConditions: 'Permitted basement construction excavation.',
        rainfall: 0,
        imageUrl: '',
        observedAt: new Date(Date.now() - 48 * 3600 * 1000),
        status: 'Rejected',
        adminNotes: 'Verified as private commercial construction pit, not a geotechnical hazard.',
      },
    ];

    await HazardReport.insertMany(demoHazardReports);
    console.log(`[AARVIK Seed] Inserted ${demoHazardReports.length} demonstration hazard reports.`);

    // 4. Demonstration Early Warning Alerts
    const demoAlerts = [
      {
        title: 'CRITICAL HAZARD ADVISORY: High Slope Saturation & Debris Flow Risk',
        description: 'Continuous torrential rainfall exceeding 140mm within 24 hours has saturated upper colluvial slopes. Steep valleys along the Alaknanda river basin are at acute risk of slope failure and toe erosion.',
        state: 'Uttarakhand',
        district: 'Chamoli',
        location: 'Joshimath-Helang Sector and Pipalkoti Gorge',
        riskLevel: 'Critical',
        recommendedPrecautions: [
          'Halt all non-emergency transit through gorge highway corridors after sunset.',
          'Residents of toe slopes and riverbanks should temporarily move to designated higher-ground shelters.',
          'Keep emergency contact numbers handy and monitor local siren broadcasts.',
          'Do not stop vehicles underneath exposed rock cuts or near overhangs.',
        ],
        status: 'Active',
        issuedBy: 'Emergency Operations Center Chamoli',
        publishedAt: new Date(Date.now() - 3 * 3600 * 1000),
        expiresAt: new Date(Date.now() + 48 * 3600 * 1000),
      },
      {
        title: 'HIGH RISK WARNING: Active Rockfall & Mudslide Vulnerability',
        description: 'Frequent rolling stones and localized slope slips observed on cutting slopes along national highway. Heavy rainfall predicted to continue through next 36 hours.',
        state: 'Himachal Pradesh',
        district: 'Mandi',
        location: 'Mandi - Pandoh Highway Corridor',
        riskLevel: 'High',
        recommendedPrecautions: [
          'Heavy transport vehicles advised to use alternate Bilaspur bypass.',
          'Stay clear of marked rockfall shooting zones.',
          'Report any fresh tension cracks or sudden muddy water flow immediately to AARVIK or police helpline 112.',
        ],
        status: 'Active',
        issuedBy: 'District Disaster Management Authority Mandi',
        publishedAt: new Date(Date.now() - 6 * 3600 * 1000),
        expiresAt: new Date(Date.now() + 36 * 3600 * 1000),
      },
      {
        title: 'MODERATE RISK WATCH: Soil Saturated Slopes along Plantation Belts',
        description: 'Soil moisture indicators show moderate saturation. While structural slope movement has not commenced, ongoing light showers maintain vulnerability on unprotected slopes.',
        state: 'Kerala',
        district: 'Idukki',
        location: 'Devikulam & Peerumedu Hill Tracks',
        riskLevel: 'Moderate',
        recommendedPrecautions: [
          'Inspect hillside estate drainage and clear clogged culverts.',
          'Farmers and estate workers should avoid steep terrain during downpours.',
          'Keep battery torches and battery-powered radio devices charged.',
        ],
        status: 'Active',
        issuedBy: 'State Disaster Management Control Room',
        publishedAt: new Date(Date.now() - 14 * 3600 * 1000),
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
      },
      {
        title: 'RESOLVED ADVISORY: Clearance Completed on NH-109 Hill Section',
        description: 'Debris from yesterday small landslide has been fully cleared by highway authorities. Both carriageways reopened with normal speed limits.',
        state: 'Uttarakhand',
        district: 'Nainital',
        location: 'Bhowali - Almora Highway Km 12',
        riskLevel: 'Low',
        recommendedPrecautions: [
          'Normal traffic resumed. Drive with caution during wet conditions.',
        ],
        status: 'Resolved',
        issuedBy: 'Public Works Department Control Desk',
        publishedAt: new Date(Date.now() - 36 * 3600 * 1000),
        expiresAt: new Date(Date.now() - 6 * 3600 * 1000),
      },
      {
        title: 'DRAFT ADVISORY: Upcoming Monsoon Inundation Assessment',
        description: 'Preliminary advisory drafted for anticipated monsoon burst. Under review by geotechnical committee.',
        state: 'Himachal Pradesh',
        district: 'Kullu',
        location: 'Parvati Valley Upper Catchment',
        riskLevel: 'Moderate',
        recommendedPrecautions: [
          'Verify camp site safety clearances.',
        ],
        status: 'Draft',
        issuedBy: 'Authorized Admin',
        publishedAt: null,
        expiresAt: null,
      },
    ];

    await Alert.insertMany(demoAlerts);
    console.log(`[AARVIK Seed] Inserted ${demoAlerts.length} demonstration alerts.`);

    console.log('====================================================');
    console.log('       AARVIK DEMONSTRATION SEED COMPLETED!         ');
    console.log('====================================================');
    console.log('All inserted records are clearly tagged as:');
    console.log(' - dataSource: "Demonstration data"');
    console.log(' - Admin Login: admin@aarvik.org / AarvikAdmin#2026');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('[AARVIK Seed] Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
