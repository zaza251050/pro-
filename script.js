// Message display function
function showMessage(message, type = 'info') {
    // ลบข้อความเก่าถ้ามี
    const existingMessage = document.querySelector('.message-popup');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // สร้างข้อความใหม่
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-popup ${type}`;
    messageDiv.textContent = message;
    
    // เพิ่มสไตล์
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    
    // สีตามประเภท
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#f44336';
    } else {
        messageDiv.style.backgroundColor = '#2196F3';
    }
    
    // เพิ่ม CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(messageDiv);
    
    // ลบข้อความหลังจาก 5 วินาที
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    // Login/Register Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Form Submissions
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const calorieForm = document.getElementById('calorieForm');
    const exerciseFilter = document.getElementById('exerciseFilter');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');
            
            if (!email || !password) {
                showMessage('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
                return;
            }
            
            // ส่งข้อมูลไปยัง backend
            fetch('login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage(data.message, 'success');
                    // เก็บข้อมูลผู้ใช้ใน localStorage
                    localStorage.setItem('user', JSON.stringify(data.user));
                    // เปลี่ยนไปหน้าแรกหลังจาก 2 วินาที
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    showMessage(data.error, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
            });
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');
            
            if (!name || !email || !password || !confirmPassword) {
                showMessage('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('รหัสผ่านไม่ตรงกัน', 'error');
                return;
            }
            
            // ส่งข้อมูลไปยัง backend
            fetch('register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage(data.message, 'success');
                    // เปลี่ยนไปแท็บ login หลังจาก 2 วินาที
                    setTimeout(() => {
                        document.querySelector('[data-tab="login"]').click();
                    }, 2000);
                } else {
                    showMessage(data.error, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
            });
        });
    }

    // Calorie Calculator
    if (calorieForm) {
        calorieForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateCalories();
        });
    }

    // Exercise Guide
    if (exerciseFilter) {
        exerciseFilter.addEventListener('submit', function(e) {
            e.preventDefault();
            showExerciseGuide();
        });
    }
    
    // ตรวจสอบสถานะการเข้าสู่ระบบ
    checkAuthStatus();
});

// ฟังก์ชันตรวจสอบสถานะการเข้าสู่ระบบ
function checkAuthStatus() {
    fetch('check_auth.php')
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                // แสดงข้อมูลผู้ใช้ใน navbar
                updateNavbarForLoggedInUser(data.user);
            }
        })
        .catch(error => {
            console.error('Error checking auth status:', error);
        });
}

// ฟังก์ชันอัปเดต navbar สำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
function updateNavbarForLoggedInUser(user) {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        // เพิ่มเมนูสำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
        const userMenuItem = document.createElement('li');
        userMenuItem.className = 'nav-item';
        userMenuItem.innerHTML = `
            <span class="nav-link user-info">
                สวัสดี, ${user.name}
                <button onclick="logout()" class="logout-btn">ออกจากระบบ</button>
            </span>
        `;
        
        // เพิ่มเมนูใหม่ก่อนเมนูสุดท้าย
        const lastItem = navMenu.lastElementChild;
        navMenu.insertBefore(userMenuItem, lastItem);
        
        // ซ่อนลิงก์เข้าสู่ระบบ
        const loginLink = navMenu.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.parentElement.style.display = 'none';
        }
    }
}

// ฟังก์ชันออกจากระบบ
function logout() {
    fetch('logout.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage(data.message, 'success');
            // ล้างข้อมูลใน localStorage
            localStorage.removeItem('user');
            // รีโหลดหน้าเว็บ
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('เกิดข้อผิดพลาดในการออกจากระบบ', 'error');
    });
}

// Calorie Calculation Functions
function calculateCalories() {
    const formData = new FormData(document.getElementById('calorieForm'));
    const gender = formData.get('gender');
    const age = parseInt(formData.get('age'));
    const weight = parseFloat(formData.get('weight'));
    const height = parseFloat(formData.get('height'));
    const activity = parseFloat(formData.get('activity'));
    const goal = formData.get('goal');

    if (!gender || !age || !weight || !height || !activity || !goal) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Calculate TDEE
    const tdee = bmr * activity;

    // Calculate recommended calories based on goal
    let recommendedCalories;
    switch (goal) {
        case 'lose':
            recommendedCalories = tdee - 500; // 500 calorie deficit
            break;
        case 'gain':
            recommendedCalories = tdee + 300; // 300 calorie surplus
            break;
        default:
            recommendedCalories = tdee; // maintain
    }

    // Calculate macronutrients
    const protein = Math.round(weight * 2.2); // 2.2g per kg body weight
    const fat = Math.round((recommendedCalories * 0.25) / 9); // 25% of calories from fat
    const carbs = Math.round((recommendedCalories - (protein * 4) - (fat * 9)) / 4);

    // Display results
    displayCalorieResults(bmr, tdee, recommendedCalories, protein, carbs, fat, goal);
}

function displayCalorieResults(bmr, tdee, recommended, protein, carbs, fat, goal) {
    document.getElementById('bmr').textContent = Math.round(bmr);
    document.getElementById('tdee').textContent = Math.round(tdee);
    document.getElementById('recommended').textContent = Math.round(recommended);
    document.getElementById('protein').textContent = protein;
    document.getElementById('carbs').textContent = carbs;
    document.getElementById('fat').textContent = fat;

    // Generate tips based on goal
    const tipsList = document.getElementById('tipsList');
    tipsList.innerHTML = '';

    const tips = getTipsForGoal(goal);
    tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsList.appendChild(li);
    });

    // Show results
    document.getElementById('results').style.display = 'block';
    document.getElementById('results').classList.add('fade-in');
}

function getTipsForGoal(goal) {
    const tips = {
        lose: [
            'กินโปรตีนให้เพียงพอเพื่อรักษามวลกล้ามเนื้อ',
            'ลดการกินอาหารแปรรูปและน้ำตาล',
            'ดื่มน้ำให้เพียงพอวันละ 8-10 แก้ว',
            'ออกกำลังกายแบบคาร์ดิโอ 3-5 ครั้งต่อสัปดาห์',
            'นอนหลับให้เพียงพอ 7-9 ชั่วโมงต่อวัน'
        ],
        maintain: [
            'รักษาสมดุลระหว่างแคลอรี่ที่กินและใช้',
            'กินอาหารที่มีประโยชน์และหลากหลาย',
            'ออกกำลังกายสม่ำเสมอ',
            'ติดตามน้ำหนักและปรับเปลี่ยนตามความเหมาะสม',
            'ดื่มน้ำให้เพียงพอ'
        ],
        gain: [
            'กินโปรตีนเพิ่มขึ้นเพื่อสร้างกล้ามเนื้อ',
            'กินอาหารที่มีแคลอรี่สูงแต่มีประโยชน์',
            'ออกกำลังกายแบบแรงต้าน 3-4 ครั้งต่อสัปดาห์',
            'กินอาหารมื้อเล็กๆ หลายมื้อต่อวัน',
            'พักผ่อนให้เพียงพอเพื่อการฟื้นฟูกล้ามเนื้อ'
        ]
    };
    return tips[goal] || tips.maintain;
}

// Exercise Guide Functions
function showExerciseGuide() {
    const formData = new FormData(document.getElementById('exerciseFilter'));
    const age = formData.get('age');
    const weight = formData.get('weight');

    if (!age || !weight) {
        alert('กรุณาเลือกข้อมูลให้ครบถ้วน');
        return;
    }

    const exercises = getExercisesForProfile(age, weight);
    const schedule = getScheduleForProfile(age, weight);
    const tips = getExerciseTips(age, weight);

    displayExerciseResults(exercises, schedule, tips);
}

function getExercisesForProfile(age, weight) {
    const exerciseData = {
        cardio: {
            teen: {
                underweight: ['วิ่ง', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'เต้นแอโรบิก'],
                normal: ['วิ่ง', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'เต้นแอโรบิก', 'เล่นกีฬา'],
                overweight: ['เดินเร็ว', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'เต้นแอโรบิก'],
                obese: ['เดิน', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'โยคะ']
            },
            young: {
                underweight: ['วิ่ง', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'เต้นแอโรบิก', 'HIIT'],
                normal: ['วิ่ง', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'เต้นแอโรบิก', 'HIIT', 'เล่นกีฬา'],
                overweight: ['เดินเร็ว', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'เต้นแอโรบิก'],
                obese: ['เดิน', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'โยคะ']
            },
            middle: {
                underweight: ['เดินเร็ว', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'เต้นแอโรบิก'],
                normal: ['เดินเร็ว', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'เต้นแอโรบิก', 'เล่นกีฬา'],
                overweight: ['เดิน', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'โยคะ'],
                obese: ['เดิน', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'โยคะ']
            },
            senior: {
                underweight: ['เดิน', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'โยคะ'],
                normal: ['เดิน', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'โยคะ', 'ไทชิ'],
                overweight: ['เดิน', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'โยคะ'],
                obese: ['เดิน', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'โยคะ']
            }
        },
        strength: {
            teen: {
                underweight: ['Push-ups', 'Squats', 'Planks', 'Pull-ups'],
                normal: ['Push-ups', 'Squats', 'Planks', 'Pull-ups', 'Weight training'],
                overweight: ['Push-ups', 'Squats', 'Planks', 'Bodyweight exercises'],
                obese: ['Wall push-ups', 'Chair squats', 'Planks', 'Bodyweight exercises']
            },
            young: {
                underweight: ['Push-ups', 'Squats', 'Planks', 'Pull-ups', 'Weight training'],
                normal: ['Push-ups', 'Squats', 'Planks', 'Pull-ups', 'Weight training'],
                overweight: ['Push-ups', 'Squats', 'Planks', 'Bodyweight exercises'],
                obese: ['Wall push-ups', 'Chair squats', 'Planks', 'Bodyweight exercises']
            },
            middle: {
                underweight: ['Push-ups', 'Squats', 'Planks', 'Bodyweight exercises'],
                normal: ['Push-ups', 'Squats', 'Planks', 'Bodyweight exercises', 'Weight training'],
                overweight: ['Wall push-ups', 'Chair squats', 'Planks', 'Bodyweight exercises'],
                obese: ['Wall push-ups', 'Chair squats', 'Planks', 'Bodyweight exercises']
            },
            senior: {
                underweight: ['Wall push-ups', 'Chair squats', 'Planks', 'Bodyweight exercises'],
                normal: ['Wall push-ups', 'Chair squats', 'Planks', 'Bodyweight exercises'],
                overweight: ['Wall push-ups', 'Chair squats', 'Planks', 'Bodyweight exercises'],
                obese: ['Wall push-ups', 'Chair squats', 'Planks', 'Bodyweight exercises']
            }
        },
        flexibility: {
            teen: {
                underweight: ['โยคะ', 'ยืดกล้ามเนื้อ', 'พิลาทิส'],
                normal: ['โยคะ', 'ยืดกล้ามเนื้อ', 'พิลาทิส'],
                overweight: ['โยคะ', 'ยืดกล้ามเนื้อ', 'พิลาทิส'],
                obese: ['โยคะ', 'ยืดกล้ามเนื้อ', 'พิลาทิส']
            },
            young: {
                underweight: ['โยคะ', 'ยืดกล้ามเนื้อ', 'พิลาทิส'],
                normal: ['โยคะ', 'ยืดกล้ามเนื้อ', 'พิลาทิส'],
                overweight: ['โยคะ', 'ยืดกล้ามเนื้อ', 'พิลาทิส'],
                obese: ['โยคะ', 'ยืดกล้ามเนื้อ', 'พิลาทิส']
            },
            middle: {
                underweight: ['โยคะ', 'ยืดกล้ามเนื้อ', 'พิลาทิส'],
                normal: ['โยคะ', 'ยืดกล้ามเนื้อ', 'พิลาทิส'],
                overweight: ['โยคะ', 'ยืดกล้ามเนื้อ', 'พิลาทิส'],
                obese: ['โยคะ', 'ยืดกล้ามเนื้อ', 'พิลาทิส']
            },
            senior: {
                underweight: ['โยคะ', 'ยืดกล้ามเนื้อ', 'ไทชิ'],
                normal: ['โยคะ', 'ยืดกล้ามเนื้อ', 'ไทชิ'],
                overweight: ['โยคะ', 'ยืดกล้ามเนื้อ', 'ไทชิ'],
                obese: ['โยคะ', 'ยืดกล้ามเนื้อ', 'ไทชิ']
            }
        }
    };

    return {
        cardio: exerciseData.cardio[age][weight],
        strength: exerciseData.strength[age][weight],
        flexibility: exerciseData.flexibility[age][weight]
    };
}

function getScheduleForProfile(age, weight) {
    const schedules = {
        teen: {
            underweight: {
                'จันทร์': 'คาร์ดิโอ 30 นาที',
                'อังคาร': 'แรงต้าน 45 นาที',
                'พุธ': 'คาร์ดิโอ 30 นาที',
                'พฤหัสบดี': 'แรงต้าน 45 นาที',
                'ศุกร์': 'คาร์ดิโอ 30 นาที',
                'เสาร์': 'ยืดหยุ่น 30 นาที',
                'อาทิตย์': 'พักผ่อน'
            },
            normal: {
                'จันทร์': 'คาร์ดิโอ 45 นาที',
                'อังคาร': 'แรงต้าน 45 นาที',
                'พุธ': 'คาร์ดิโอ 45 นาที',
                'พฤหัสบดี': 'แรงต้าน 45 นาที',
                'ศุกร์': 'คาร์ดิโอ 45 นาที',
                'เสาร์': 'ยืดหยุ่น 30 นาที',
                'อาทิตย์': 'พักผ่อน'
            },
            overweight: {
                'จันทร์': 'คาร์ดิโอ 30 นาที',
                'อังคาร': 'แรงต้าน 30 นาที',
                'พุธ': 'คาร์ดิโอ 30 นาที',
                'พฤหัสบดี': 'แรงต้าน 30 นาที',
                'ศุกร์': 'คาร์ดิโอ 30 นาที',
                'เสาร์': 'ยืดหยุ่น 30 นาที',
                'อาทิตย์': 'พักผ่อน'
            },
            obese: {
                'จันทร์': 'คาร์ดิโอ 20 นาที',
                'อังคาร': 'แรงต้าน 20 นาที',
                'พุธ': 'คาร์ดิโอ 20 นาที',
                'พฤหัสบดี': 'แรงต้าน 20 นาที',
                'ศุกร์': 'คาร์ดิโอ 20 นาที',
                'เสาร์': 'ยืดหยุ่น 30 นาที',
                'อาทิตย์': 'พักผ่อน'
            }
        },
        young: {
            underweight: {
                'จันทร์': 'คาร์ดิโอ 45 นาที',
                'อังคาร': 'แรงต้าน 60 นาที',
                'พุธ': 'คาร์ดิโอ 45 นาที',
                'พฤหัสบดี': 'แรงต้าน 60 นาที',
                'ศุกร์': 'คาร์ดิโอ 45 นาที',
                'เสาร์': 'ยืดหยุ่น 30 นาที',
                'อาทิตย์': 'พักผ่อน'
            },
            normal: {
                'จันทร์': 'คาร์ดิโอ 60 นาที',
                'อังคาร': 'แรงต้าน 60 นาที',
                'พุธ': 'คาร์ดิโอ 60 นาที',
                'พฤหัสบดี': 'แรงต้าน 60 นาที',
                'ศุกร์': 'คาร์ดิโอ 60 นาที',
                'เสาร์': 'ยืดหยุ่น 45 นาที',
                'อาทิตย์': 'พักผ่อน'
            },
            overweight: {
                'จันทร์': 'คาร์ดิโอ 45 นาที',
                'อังคาร': 'แรงต้าน 45 นาที',
                'พุธ': 'คาร์ดิโอ 45 นาที',
                'พฤหัสบดี': 'แรงต้าน 45 นาที',
                'ศุกร์': 'คาร์ดิโอ 45 นาที',
                'เสาร์': 'ยืดหยุ่น 30 นาที',
                'อาทิตย์': 'พักผ่อน'
            },
            obese: {
                'จันทร์': 'คาร์ดิโอ 30 นาที',
                'อังคาร': 'แรงต้าน 30 นาที',
                'พุธ': 'คาร์ดิโอ 30 นาที',
                'พฤหัสบดี': 'แรงต้าน 30 นาที',
                'ศุกร์': 'คาร์ดิโอ 30 นาที',
                'เสาร์': 'ยืดหยุ่น 30 นาที',
                'อาทิตย์': 'พักผ่อน'
            }
        },
        middle: {
            underweight: {
                'จันทร์': 'คาร์ดิโอ 30 นาที',
                'อังคาร': 'แรงต้าน 45 นาที',
                'พุธ': 'คาร์ดิโอ 30 นาที',
                'พฤหัสบดี': 'แรงต้าน 45 นาที',
                'ศุกร์': 'คาร์ดิโอ 30 นาที',
                'เสาร์': 'ยืดหยุ่น 30 นาที',
                'อาทิตย์': 'พักผ่อน'
            },
            normal: {
                'จันทร์': 'คาร์ดิโอ 45 นาที',
                'อังคาร': 'แรงต้าน 45 นาที',
                'พุธ': 'คาร์ดิโอ 45 นาที',
                'พฤหัสบดี': 'แรงต้าน 45 นาที',
                'ศุกร์': 'คาร์ดิโอ 45 นาที',
                'เสาร์': 'ยืดหยุ่น 30 นาที',
                'อาทิตย์': 'พักผ่อน'
            },
            overweight: {
                'จันทร์': 'คาร์ดิโอ 30 นาที',
                'อังคาร': 'แรงต้าน 30 นาที',
                'พุธ': 'คาร์ดิโอ 30 นาที',
                'พฤหัสบดี': 'แรงต้าน 30 นาที',
                'ศุกร์': 'คาร์ดิโอ 30 นาที',
                'เสาร์': 'ยืดหยุ่น 30 นาที',
                'อาทิตย์': 'พักผ่อน'
            },
            obese: {
                'จันทร์': 'คาร์ดิโอ 20 นาที',
                'อังคาร': 'แรงต้าน 20 นาที',
                'พุธ': 'คาร์ดิโอ 20 นาที',
                'พฤหัสบดี': 'แรงต้าน 20 นาที',
                'ศุกร์': 'คาร์ดิโอ 20 นาที',
                'เสาร์': 'ยืดหยุ่น 30 นาที',
                'อาทิตย์': 'พักผ่อน'
            }
        },
        senior: {
            underweight: {
                'จันทร์': 'คาร์ดิโอ 20 นาที',
                'อังคาร': 'แรงต้าน 20 นาที',
                'พุธ': 'คาร์ดิโอ 20 นาที',
                'พฤหัสบดี': 'แรงต้าน 20 นาที',
                'ศุกร์': 'คาร์ดิโอ 20 นาที',
                'เสาร์': 'ยืดหยุ่น 30 นาที',
                'อาทิตย์': 'พักผ่อน'
            },
            normal: {
                'จันทร์': 'คาร์ดิโอ 30 นาที',
                'อังคาร': 'แรงต้าน 30 นาที',
                'พุธ': 'คาร์ดิโอ 30 นาที',
                'พฤหัสบดี': 'แรงต้าน 30 นาที',
                'ศุกร์': 'คาร์ดิโอ 30 นาที',
                'เสาร์': 'ยืดหยุ่น 30 นาที',
                'อาทิตย์': 'พักผ่อน'
            },
            overweight: {
                'จันทร์': 'คาร์ดิโอ 20 นาที',
                'อังคาร': 'แรงต้าน 20 นาที',
                'พุธ': 'คาร์ดิโอ 20 นาที',
                'พฤหัสบดี': 'แรงต้าน 20 นาที',
                'ศุกร์': 'คาร์ดิโอ 20 นาที',
                'เสาร์': 'ยืดหยุ่น 30 นาที',
                'อาทิตย์': 'พักผ่อน'
            },
            obese: {
                'จันทร์': 'คาร์ดิโอ 15 นาที',
                'อังคาร': 'แรงต้าน 15 นาที',
                'พุธ': 'คาร์ดิโอ 15 นาที',
                'พฤหัสบดี': 'แรงต้าน 15 นาที',
                'ศุกร์': 'คาร์ดิโอ 15 นาที',
                'เสาร์': 'ยืดหยุ่น 30 นาที',
                'อาทิตย์': 'พักผ่อน'
            }
        }
    };

    return schedules[age][weight];
}

function getExerciseTips(age, weight) {
    const tips = {
        teen: {
            underweight: [
                'เน้นการออกกำลังกายที่ช่วยเพิ่มมวลกล้ามเนื้อ',
                'กินอาหารที่มีโปรตีนสูง',
                'ออกกำลังกายอย่างสม่ำเสมอ',
                'ปรึกษาผู้เชี่ยวชาญก่อนเริ่มโปรแกรมใหม่'
            ],
            normal: [
                'ออกกำลังกายอย่างหลากหลาย',
                'เน้นทั้งคาร์ดิโอและแรงต้าน',
                'กินอาหารที่มีประโยชน์',
                'พักผ่อนให้เพียงพอ'
            ],
            overweight: [
                'เริ่มต้นอย่างค่อยเป็นค่อยไป',
                'เน้นการออกกำลังกายแบบคาร์ดิโอ',
                'ควบคุมอาหารควบคู่กับการออกกำลังกาย',
                'ตั้งเป้าหมายที่ realistic'
            ],
            obese: [
                'ปรึกษาแพทย์ก่อนเริ่มออกกำลังกาย',
                'เริ่มต้นด้วยการเดิน',
                'เน้นการออกกำลังกายที่มีแรงกระแทกต่ำ',
                'ปรับเปลี่ยนพฤติกรรมการกิน'
            ]
        },
        young: {
            underweight: [
                'เน้นการออกกำลังกายแบบแรงต้าน',
                'กินอาหารที่มีแคลอรี่และโปรตีนสูง',
                'ออกกำลังกายอย่างสม่ำเสมอ',
                'ติดตามความคืบหน้า'
            ],
            normal: [
                'ออกกำลังกายอย่างหลากหลาย',
                'เน้นทั้งคาร์ดิโอและแรงต้าน',
                'กินอาหารที่มีประโยชน์',
                'พักผ่อนให้เพียงพอ'
            ],
            overweight: [
                'เริ่มต้นอย่างค่อยเป็นค่อยไป',
                'เน้นการออกกำลังกายแบบคาร์ดิโอ',
                'ควบคุมอาหารควบคู่กับการออกกำลังกาย',
                'ตั้งเป้าหมายที่ realistic'
            ],
            obese: [
                'ปรึกษาแพทย์ก่อนเริ่มออกกำลังกาย',
                'เริ่มต้นด้วยการเดิน',
                'เน้นการออกกำลังกายที่มีแรงกระแทกต่ำ',
                'ปรับเปลี่ยนพฤติกรรมการกิน'
            ]
        },
        middle: {
            underweight: [
                'เน้นการออกกำลังกายแบบแรงต้าน',
                'กินอาหารที่มีแคลอรี่และโปรตีนสูง',
                'ออกกำลังกายอย่างสม่ำเสมอ',
                'ติดตามความคืบหน้า'
            ],
            normal: [
                'ออกกำลังกายอย่างหลากหลาย',
                'เน้นทั้งคาร์ดิโอและแรงต้าน',
                'กินอาหารที่มีประโยชน์',
                'พักผ่อนให้เพียงพอ'
            ],
            overweight: [
                'เริ่มต้นอย่างค่อยเป็นค่อยไป',
                'เน้นการออกกำลังกายแบบคาร์ดิโอ',
                'ควบคุมอาหารควบคู่กับการออกกำลังกาย',
                'ตั้งเป้าหมายที่ realistic'
            ],
            obese: [
                'ปรึกษาแพทย์ก่อนเริ่มออกกำลังกาย',
                'เริ่มต้นด้วยการเดิน',
                'เน้นการออกกำลังกายที่มีแรงกระแทกต่ำ',
                'ปรับเปลี่ยนพฤติกรรมการกิน'
            ]
        },
        senior: {
            underweight: [
                'เน้นการออกกำลังกายแบบแรงต้านเบาๆ',
                'กินอาหารที่มีแคลอรี่และโปรตีนสูง',
                'ออกกำลังกายอย่างสม่ำเสมอ',
                'ปรึกษาแพทย์ก่อนเริ่มโปรแกรมใหม่'
            ],
            normal: [
                'ออกกำลังกายอย่างหลากหลาย',
                'เน้นทั้งคาร์ดิโอและแรงต้าน',
                'กินอาหารที่มีประโยชน์',
                'พักผ่อนให้เพียงพอ'
            ],
            overweight: [
                'เริ่มต้นอย่างค่อยเป็นค่อยไป',
                'เน้นการออกกำลังกายแบบคาร์ดิโอ',
                'ควบคุมอาหารควบคู่กับการออกกำลังกาย',
                'ตั้งเป้าหมายที่ realistic'
            ],
            obese: [
                'ปรึกษาแพทย์ก่อนเริ่มออกกำลังกาย',
                'เริ่มต้นด้วยการเดิน',
                'เน้นการออกกำลังกายที่มีแรงกระแทกต่ำ',
                'ปรับเปลี่ยนพฤติกรรมการกิน'
            ]
        }
    };

    return tips[age][weight];
}

function displayExerciseResults(exercises, schedule, tips) {
    // Display cardio exercises
    const cardioList = document.getElementById('cardioExercises');
    cardioList.innerHTML = '';
    exercises.cardio.forEach(exercise => {
        const li = document.createElement('li');
        li.textContent = exercise;
        cardioList.appendChild(li);
    });

    // Display strength exercises
    const strengthList = document.getElementById('strengthExercises');
    strengthList.innerHTML = '';
    exercises.strength.forEach(exercise => {
        const li = document.createElement('li');
        li.textContent = exercise;
        strengthList.appendChild(li);
    });

    // Display flexibility exercises
    const flexibilityList = document.getElementById('flexibilityExercises');
    flexibilityList.innerHTML = '';
    exercises.flexibility.forEach(exercise => {
        const li = document.createElement('li');
        li.textContent = exercise;
        flexibilityList.appendChild(li);
    });

    // Display schedule
    const scheduleGrid = document.getElementById('exerciseSchedule');
    scheduleGrid.innerHTML = '';
    Object.entries(schedule).forEach(([day, activity]) => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'schedule-day';
        dayDiv.innerHTML = `
            <h4>${day}</h4>
            <p>${activity}</p>
        `;
        scheduleGrid.appendChild(dayDiv);
    });

    // Display tips
    const tipsContent = document.getElementById('exerciseTips');
    tipsContent.innerHTML = '';
    tips.forEach(tip => {
        const p = document.createElement('p');
        p.textContent = tip;
        tipsContent.appendChild(p);
    });

    // Show results
    document.getElementById('exerciseResults').style.display = 'block';
    document.getElementById('exerciseResults').classList.add('fade-in');
} 