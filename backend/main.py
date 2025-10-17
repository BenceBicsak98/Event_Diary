"""
This module implements a FastAPI backend for managing dispatcher diary events. 
It provides endpoints for CRUD operations on events, querying data, and managing history records.
Modules and Libraries:
- FastAPI: Framework for building APIs.
- oracledb: Oracle database connectivity.
- pydantic: Data validation and settings management.
- datetime: Date and time manipulation.
- re: Regular expressions for string processing.
Classes:
- EVENT: Pydantic model representing an event with fields such as ID, reported_time, settlement_name, etc.
Functions:
- fetch_all_dict(cursor): Converts database query results into a list of dictionaries.
Endpoints:
1. `/get_dispatcher_diary_DEPARTMENTS` [GET]:
    Fetches all departments from the database.
2. `/issue_types` [GET]:
    Fetches all issue types (failure types) from the database.
3. `/formelements` [GET]:
    Fetches settlement names and their associated street names.
4. `/workers/{user_id}` [GET]:
    Fetches workers associated with a specific user ID.
5. `/get_dispatcher_diary_EVENTS` [GET]:
    Fetches events based on optional filters such as date range, issue type, and user ID.
6. `/new_Event/{ID}` [POST]:
    Inserts a new event into the database and logs the action in the history.
7. `/update_Event/{user_id}` [PUT]:
    Updates an existing event and logs the changes in the history.
8. `/delete_Event/{user_id}` [DELETE]:
    Deletes an event and logs the action in the history.
9. `/get_history_dispatcher_diary` [GET]:
    Fetches history records based on optional filters such as date range and user ID.
10. `/add_new_history_element` [POST]:
     Adds a new history record to the database.
Middleware:
- CORS Middleware: Configured to allow all origins, credentials, methods, and headers.
Database Configuration:
- Oracle database connection details are defined as constants (DB_USER_misz, DB_PASS_misz, DB_DSN_misz).
Router:
- Includes an `auth_router` for authentication-related routes.
Error Handling:
- Each endpoint includes error handling for database connection issues and other exceptions.
Notes:
- Oracle Instant Client library directory is specified as `C:\\instantclient_11_2`.
- SQL queries use parameterized inputs to prevent SQL injection.
"""

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router 
from ai_ask import router as ai_ask_router
import oracledb
from typing import Optional
import re
from pydantic import BaseModel, Field
from datetime import datetime

app = FastAPI()

class EVENT(BaseModel):
    ID: Optional[int] = None
    reported_time: datetime = Field(..., alias="reported_time")
    settlement_name: str
    street_name: str
    house_number: int
    description: str
    response: str
    failure_type: str
    worker_name: str
    handover_time: datetime = Field(..., alias="handover_time")

# Oracle config misz
DB_USER_misz = "misz"
DB_PASS_misz = "misz"
DB_DSN_misz = "mirdb2.vasiviz.hu:1521/mirdb.vasiviz.hu"

# CORS config for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def fetch_all_dict(cursor):
    columns = [col[0] for col in cursor.description]
    results = []
    for row in cursor.fetchall():
        row_dict = {}
        for col_name, value in zip(columns, row):
            if isinstance(value, oracledb.LOB):
                value = value.read()
                value = re.sub(r"</?E>", "", value)
                value = value.strip().rstrip(",") 
            row_dict[col_name] = value
        results.append(row_dict)
    return results

@app.get("/get_dispatcher_diary_DEPARTMENTS")
async def get_dispatcher_diary_DEPARTMENTS():
    print("👉 Start the dispatcher_diary_events query")  # DEBUG
    try:
        try:
            # Connection
            # oracledb.init_oracle_client(lib_dir="C:\\instantclient_11_2")
            oracledb.init_oracle_client(lib_dir="/opt/oracle/instantclient")
            connection = oracledb.connect(user=DB_USER_misz, password=DB_PASS_misz, dsn=DB_DSN_misz)
            print("✅ Connect to the Oracle")  # DEBUG
            cursor = connection.cursor()
        except oracledb.DatabaseError as e:
            error, = e.args
            print("❌ Fault at the connection:")
            print(error.message)
        
        # QUERY
        sql = (
            """
            SELECT * FROM ER_DEPARTMENTS
            """
        )

        print("➡️  Query progress")
        cursor.execute(sql)
        print("✅ Query")  # DEBUG
        
        if cursor.description is None:
            print("❗ The query is empty")
        else:
            
            # Convert to dict list
            data = fetch_all_dict(cursor)
            print(f"✅ {len(data)} rows fetched")
            print("✅ Success convert and forward to the frontend")


        return {"eredmeny": data}
        

    except Exception as e:
        print(f"❌ Hiba: {e}")
        return {"hiba": str(e)}

    finally:
        try:
            cursor.close()
            connection.close()
        except:
            pass

@app.get("/issue_types")
async def get_issue_types():
    print("👉 Start the issue_types query")  # DEBUG
    try:
        try:
            # Connection
            # oracledb.init_oracle_client(lib_dir="C:\\instantclient_11_2")
            oracledb.init_oracle_client(lib_dir="/opt/oracle/instantclient")
            connection = oracledb.connect(user=DB_USER_misz, password=DB_PASS_misz, dsn=DB_DSN_misz)
            print("✅ Connect to the Oracle")  # DEBUG
            cursor = connection.cursor()
        except oracledb.DatabaseError as e:
            error, = e.args
            print("❌ Fault at the connection:")
            print(error.message)
        
        # QUERY
        sql = (
            """
            SELECT NAME AS FAILURE_TYPES FROM ER_FAILURE_TYPES
            """
        )

        print("➡️  Query progress")
        cursor.execute(sql)
        print("✅ Query")  # DEBUG
        
        if cursor.description is None:
            print("❗ The query is empty")
        else:
            
            # Convert to dict list
            data = fetch_all_dict(cursor)
            print(f"✅ {len(data)} rows fetched")
            print("✅ Success convert and forward to the frontend")

        return {"eredmeny": data}
        
    except Exception as e:
        print(f"❌ Hiba: {e}")
        return {"hiba": str(e)}

    finally:
        try:
            cursor.close()
            connection.close()
        except:
            pass

@app.get("/formelements")
async def get_formelements():
    print("👉 Start the formelements query")  # DEBUG
    try:
        try:
            # Connection
            # oracledb.init_oracle_client(lib_dir="C:\\instantclient_11_2")
            oracledb.init_oracle_client(lib_dir="/opt/oracle/instantclient")
            connection = oracledb.connect(user=DB_USER_misz, password=DB_PASS_misz, dsn=DB_DSN_misz)
            print("✅ Connect to the Oracle")  # DEBUG
            cursor = connection.cursor()
        except oracledb.DatabaseError as e:
            error, = e.args
            print("❌ Fault at the connection:")
            print(error.message)
        
        # QUERY
        sql = (
            """
            SELECT 
                E_ST.NAME AS SETTLEMENT_NAME,
                RTRIM(
                    XMLAGG(XMLELEMENT(e, E_S.NAME || ', ') ORDER BY E_S.NAME).getClobVal(),
                    ', '
                ) AS STREET_NAMES
            FROM ER_STREETS E_S
            JOIN ER_SETTLEMENTS_STREETS E_S_S ON E_S.ID = E_S_S.STREET_ID
            JOIN ER_SETTLEMENTS E_ST ON E_S_S.SETTLEMENT_ID = E_ST.ID
            GROUP BY E_ST.NAME
            """
        )
        
        print("➡️  Query progress")
        cursor.execute(sql)
        print("✅ Query")  # DEBUG
        
        if cursor.description is None:
            print("❗ The query is empty")
            data = []
        else:
            
            # Convert to dict list
            
            data = fetch_all_dict(cursor)
            print(f"✅ {len(data)} rows fetched")
            print("✅ Success convert and forward to the frontend")

            return {"eredmeny": data}
        
    except Exception as e:
        print(f"❌ Hiba: {e}")
        return {"hiba": str(e)}

    finally:
        try:
            cursor.close()
            connection.close()
        except:
            pass

@app.get("/workers/{user_id}")
async def get_workers(user_id: int):
    print("👉 Start the workers query")  # DEBUG
    try:
        try:
            # Connection
            # oracledb.init_oracle_client(lib_dir="C:\\instantclient_11_2")
            oracledb.init_oracle_client(lib_dir="/opt/oracle/instantclient")
            connection = oracledb.connect(user=DB_USER_misz, password=DB_PASS_misz, dsn=DB_DSN_misz)
            print("✅ Connect to the Oracle")  # DEBUG
            cursor = connection.cursor()
        except oracledb.DatabaseError as e:
            error, = e.args
            print("❌ Fault at the connection:")
            print(error.message)
        
        # QUERY
        sql = (
            """
            SELECT (ER_WORKERS.FIRST_NAME || ' ' || ER_WORKERS.LAST_NAME) AS "Name"
            FROM ER_WORKERS
            INNER JOIN ER_DEPARTMENTS ED ON ER_WORKERS.DEPARTMENT_ID = ED.ID
            INNER JOIN ER_USERS_DEPARTMENTS EUD ON ED.ID = EUD.DEPARTMENT_ID
            INNER JOIN ER_USERS EU ON EUD.USER_ID = EU.ID
            WHERE ED.ID = EUD.DEPARTMENT_ID 
                AND ER_WORKERS.DEPARTMENT_ID = EUD.DEPARTMENT_ID 
                AND EUD.USER_ID = EU.ID 
                AND EU.ID = :user_id
            """
        )
        cursor.execute(sql, {
            "user_id": user_id
        })
        
        print("➡️  Query progress")
        cursor.execute(sql)
        print("✅ Query")  # DEBUG
        
        if cursor.description is None:
            print("❗ The query is empty")
            data = []
        else:
            
            # Convert to dict list
            
            data = fetch_all_dict(cursor)
            print(f"✅ {len(data)} rows fetched")
            print("✅ Success convert and forward to the frontend")

            return {"eredmeny": data}
        
    except Exception as e:
        print(f"❌ Hiba: {e}")
        return {"hiba": str(e)}

    finally:
        try:
            cursor.close()
            connection.close()
        except:
            pass

@app.get("/get_dispatcher_diary_EVENTS")
async def get_dispatcher_diary_EVENTS(
    fromDate: Optional[str] = Query(None, description="YYYY-MM-DD format"),
    toDate: Optional[str] = Query(None, description="YYYY-MM-DD format"),
    issueType: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None)
):
    print(fromDate)
    print(toDate)
    print(issueType)
    print(user_id)

     # Convert user_id to int if it's a digit, otherwise set to None
    user_id = int(user_id) if user_id is not None and user_id.isdigit() else None

    print("👉 Start the dispatcher_diary_events query")
    try:
        try:
            # oracledb.init_oracle_client(lib_dir="C:\\instantclient_11_2")
            oracledb.init_oracle_client(lib_dir="/opt/oracle/instantclient")
            connection = oracledb.connect(user=DB_USER_misz, password=DB_PASS_misz, dsn=DB_DSN_misz)
            print("✅ Connect to the Oracle")
            cursor = connection.cursor()
        except oracledb.DatabaseError as e:
            error, = e.args
            print("❌ Fault at the connection:")
            print(error.message)
            return {"hiba": error.message}

        # Alap SQL
        sql = """SELECT 
                    E_E.ID AS ID,
                    E_E.REPORTED_TIME AS REPORTED_TIME,
                    E_S.NAME AS SETTELMENT_NAME,
                    E_ST.NAME AS STREET_NAME,
                    E_E.HOUSE_NUMBER AS HOUSE_NUMBER,
                    E_E.DESCRIPTION AS DESCRIPTION,
                    E_E.RESPONSE AS RESPONSE,
                    E_F.NAME AS FAILURE_TYPE,
                    E_W.FIRST_NAME || ' ' || E_W.LAST_NAME AS WORKER_NAME,
                    E_E.HANDOVER_TIME AS HANDOVER_TIME
                FROM ER_EVENTS E_E
                LEFT JOIN ER_SETTLEMENTS E_S ON E_E.SETTLEMENT_ID = E_S.ID
                LEFT JOIN ER_STREETS E_ST ON E_E.STREET_ID = E_ST.ID
                LEFT JOIN ER_FAILURE_TYPES E_F ON E_E.FAILURE_TYPE_ID = E_F.ID
                LEFT JOIN ER_WORKERS E_W ON E_E.WORKER_ID = E_W.ID
                LEFT JOIN ER_DEPARTMENTS E_D ON E_W.DEPARTMENT_ID = E_D.ID
                LEFT JOIN ER_USERS_DEPARTMENTS E_UD ON E_D.ID = E_UD.DEPARTMENT_ID
                WHERE 1=1
        """
        
        params = {}

        # Csak dátum alapján szűrés (idő figyelmen kívül hagyva)
        if fromDate is not None and fromDate != '' and toDate is not None and toDate != '':
            sql += " AND TRUNC(E_E.REPORTED_TIME) BETWEEN TO_DATE(:fromDate, 'YYYY-MM-DD') AND TO_DATE(:toDate, 'YYYY-MM-DD')"
            params["fromDate"] = fromDate
            params["toDate"] = toDate
        
        # Hibatípus szűrés
        if issueType is not None and issueType != '':   
            sql += " AND E_F.NAME = :issueType"
            params["issueType"] = issueType
        # Felhasználó szűrés
        if user_id is not None:
            sql += " AND E_UD.USER_ID = :user_id AND E_W.DEPARTMENT_ID = E_UD.DEPARTMENT_ID"
            params["user_id"] = user_id
        
        sql += " ORDER BY E_E.REPORTED_TIME DESC"

        print("➡️  Query progress")
        cursor.execute(sql, params)
        print("✅ Query executed")

        if cursor.description is None:
            print("❗ A lekérdezés üres")
            data = []
        else:
            data = fetch_all_dict(cursor)
            print(f"✅ {len(data)} sor betöltve")
        return {"eredmeny": data}

    except Exception as e:
        print(f"❌ Hiba: {e}")
        return {"hiba": str(e)}

    finally:
        try:
            cursor.close()
            connection.close()
        except:
            pass

@app.post("/new_Event/{ID}")
async def set_new_Event(ID:int, event: EVENT):
    try:
        try:
            # oracledb.init_oracle_client(lib_dir="C:\\instantclient_11_2")
            oracledb.init_oracle_client(lib_dir="/opt/oracle/instantclient")
            connection = oracledb.connect(user=DB_USER_misz, password=DB_PASS_misz, dsn=DB_DSN_misz)
            print("✅ Connect to the Oracle")
            cursor = connection.cursor()
        except oracledb.DatabaseError as e:
            error, = e.args
            print("❌ Fault at the connection:")
            print(error.message)
            return {"hiba": error.message}

        # Alap SQL
        sql = """INSERT INTO ER_EVENTS (   
                        REPORTED_TIME,
                        SETTLEMENT_ID, 
                        STREET_ID, 
                        HOUSE_NUMBER, 
                        DESCRIPTION, 
                        RESPONSE, 
                        FAILURE_TYPE_ID,
                        WORKER_ID,
                        HANDOVER_TIME
                    )
                VALUES 
                    (   :reported_time, 
                        (SELECT ES.ID
                            FROM ER_SETTLEMENTS ES
                            WHERE ES.NAME LIKE :settlement
                        ),
                        (SELECT ES.ID
                            FROM ER_STREETS ES
                            WHERE ES.NAME LIKE :street
                        ),
                        :house_number,
                        :description, 
                        :response,
                        (SELECT EF.ID
                            FROM ER_FAILURE_TYPES EF
                            WHERE EF.NAME LIKE :failure_type 
                        ),
                        (SELECT EW.ID
                            FROM ER_WORKERS EW
                            WHERE TRIM(first_name || ' ' || last_name) = :worker_name 
                        ),
                        :handover_time
                    )
        """
        
        cursor.execute(sql, {
            "reported_time": event.reported_time,
            "settlement": event.settlement_name,
            "street": event.street_name,
            "house_number": event.house_number,
            "description": event.description,
            "response": event.response,
            "failure_type": event.failure_type,
            "worker_name": event.worker_name,
            "handover_time": event.handover_time
        })

        # Add to history
        description = f"""
            Új esemény rögzítés. 
            Dátum: {(datetime.fromisoformat(str(event.reported_time))).strftime("%Y-%m-%d %H:%M")},
            Helyszín: {event.settlement_name} {event.street_name} {event.house_number},
            Leírás: {event.description},
            Állapot: {event.response},
            Eseménytípus: {event.failure_type},
            Munkatárs: {event.worker_name},
            Átadás időpontja: {(datetime.fromisoformat(str(event.handover_time))).strftime("%Y-%m-%d %H:%M")}
        """

        await add_new_history_element(ID, description)

        connection.commit()
        return {"status": "Sikeres beszúrás"}

    except Exception as e:
        print(f"❌ Hiba: {e}")
        return {"hiba": str(e)}

    finally:
        try:
            cursor.close()
            connection.close()
        except:
            pass

@app.put("/update_Event/{user_id}")
async def update_Event(user_id: int, event: EVENT):
    print(user_id)
    try:
        try:
            # oracledb.init_oracle_client(lib_dir="C:\\instantclient_11_2")
            oracledb.init_oracle_client(lib_dir="/opt/oracle/instantclient")
            connection = oracledb.connect(user=DB_USER_misz, password=DB_PASS_misz, dsn=DB_DSN_misz)
            print("✅ Connect to the Oracle")
            cursor = connection.cursor()
        except oracledb.DatabaseError as e:
            error, = e.args
            print("❌ Fault at the connection:")
            print(error.message)
            return {"hiba": error.message}

        # Régi adatok lekérése
        cursor.execute("""
                        SELECT 
                            ER_SETTLEMENTS.NAME AS "SETTLEMENT_NAME",
                            ER_STREETS.NAME AS "STREET_NAME",
                            ER_EVENTS.HOUSE_NUMBER,
                            ER_EVENTS.DESCRIPTION,
                            ER_EVENTS.RESPONSE,
                            ER_FAILURE_TYPES.NAME AS "FAILURE_TYPE",
                            TRIM(ER_WORKERS.FIRST_NAME || ' ' || ER_WORKERS.LAST_NAME) AS WORKER_NAME
                        FROM ER_EVENTS
                        INNER JOIN ER_SETTLEMENTS ON ER_EVENTS.SETTLEMENT_ID = ER_SETTLEMENTS.ID
                        INNER JOIN ER_STREETS ON ER_EVENTS.STREET_ID = ER_STREETS.ID
                        INNER JOIN ER_FAILURE_TYPES ON ER_EVENTS.FAILURE_TYPE_ID = ER_FAILURE_TYPES.ID
                        INNER JOIN ER_WORKERS ON ER_EVENTS.WORKER_ID = ER_WORKERS.ID
                        WHERE ER_EVENTS.ID = :EVENT_ID
                       """, {"EVENT_ID": event.ID})
        
        columns = [col[0].lower() for col in cursor.description]
        old_event = dict(zip(columns,cursor.fetchone()))
        if not old_event:
            return {"hiba": "Esemény nem található"}
        
        # Alap SQL
        sql = """UPDATE ER_EVENTS
                 SET 
                     REPORTED_TIME = :REPORTED_TIME,
                     SETTLEMENT_ID = (SELECT ES.ID
                                             FROM ER_SETTLEMENTS ES
                                             WHERE ES.NAME LIKE :settlement
                                         ),
                     STREET_ID = (SELECT ES.ID
                                             FROM ER_STREETS ES
                                             WHERE ES.NAME LIKE :street
                                         ),
                     HOUSE_NUMBER = :HOUSE_NUMBER,
                     DESCRIPTION = :DESCRIPTION,
                     RESPONSE = :RESPONSE,
                     FAILURE_TYPE_ID = (SELECT EF.ID
                                             FROM ER_FAILURE_TYPES EF
                                             WHERE EF.NAME LIKE :failure_type 
                                         ),
                     WORKER_ID = (SELECT EW.ID
                                             FROM ER_WORKERS EW
                                             WHERE TRIM(first_name || ' ' || last_name) = :worker_name 
                                         ),
                     HANDOVER_TIME = :handover_time
                 WHERE ID = :EVENT_ID
        """
        
        cursor.execute(sql, {
            "REPORTED_TIME": event.reported_time,
            "settlement": event.settlement_name,
            "street": event.street_name,
            "HOUSE_NUMBER": event.house_number,
            "DESCRIPTION": event.description,
            "RESPONSE": event.response,
            "failure_type": event.failure_type,
            "worker_name": event.worker_name,
            "handover_time": event.handover_time,
            "EVENT_ID": event.ID
        })

        changes = []
        print("Detecting changes...")
        new_event = event.model_dump(by_alias=True)

        for field in EVENT.model_fields.keys():
            if field == "ID":
                continue
            old_value = old_event.get(field.lower())
            new_value = new_event.get(field.lower())
            if str(old_value) != str(new_value):
                changes.append((field, old_value, new_value))

        # Add to history
        description = f"""
            Esemény módosítás. 
            Esemény ID: {event.ID}\n
        """
        print("Changes detected:")
        for change in changes[1:-1]:
            description += f"{change[0]}: {change[1]} -> {change[2]}\n"
        

        await add_new_history_element(user_id, description)

        connection.commit()
        return {"status": "Sikeres Frissítés"}

    except Exception as e:
        print(f"❌ Hiba: {e}")
        return {"hiba": str(e)}

    finally:
        try:
            cursor.close()
            connection.close()
        except:
            pass

@app.delete("/delete_Event/{user_id}")
async def delete_Event(user_id: int, delet_event:EVENT):
    try:
        try:
            # oracledb.init_oracle_client(lib_dir="C:\\instantclient_11_2")
            oracledb.init_oracle_client(lib_dir="/opt/oracle/instantclient")
            connection = oracledb.connect(user=DB_USER_misz, password=DB_PASS_misz, dsn=DB_DSN_misz)
            cursor = connection.cursor()
        except oracledb.DatabaseError as e:
            error, = e.args
            print("❌ Fault at the connection:")
            print(error.message)
            return {"hiba": error.message}
       

        # Alap SQL
        print(f"Deleting event with ID: {delet_event.ID}")
        sql = """
                DELETE FROM ER_EVENTS WHERE ER_EVENTS.ID = :ID
              """
        cursor.execute(sql, {
            "ID": delet_event.ID
        })

        # Add to history
        description = f"""
            Esemény törölve.
            Dátum: {(datetime.fromisoformat(str(delet_event.reported_time))).strftime("%Y-%m-%d %H:%M")},
            Helyszín: {delet_event.settlement_name} {delet_event.street_name} {delet_event.house_number},
            Leírás: {delet_event.description},
            Állapot: {delet_event.response},
            Eseménytípus: {delet_event.failure_type},
            Munkatárs: {delet_event.worker_name},
            Átadás időpontja: {(datetime.fromisoformat(str(delet_event.handover_time))).strftime("%Y-%m-%d %H:%M")},
            """
        
        await add_new_history_element(user_id, description)

        connection.commit()
        return {"status": "Successful deletion"}

    except Exception as e:
        print(f"❌ Error: {e}")
        return {"Error": str(e)}

    finally:
        try:
            cursor.close()
            connection.close()
        except:
            pass

@app.get("/get_history_dispatcher_diary")
async def get_history_EVENTS(
    fromDate: Optional[str] = Query(None, description="YYYY-MM-DD format"),
    toDate: Optional[str] = Query(None, description="YYYY-MM-DD format"),
    user_id: Optional[str] = Query(None)
):

     # Convert user_id to int if it's a digit, otherwise set to None
    user_id = int(user_id) if user_id is not None and user_id.isdigit() else None

    print("👉 Start the history_events query")

    try:
        try:
            # oracledb.init_oracle_client(lib_dir="C:\\instantclient_11_2")
            oracledb.init_oracle_client(lib_dir="/opt/oracle/instantclient")
            connection = oracledb.connect(user=DB_USER_misz, password=DB_PASS_misz, dsn=DB_DSN_misz)
            print("✅ Connect to the Oracle")
            cursor = connection.cursor()
        except oracledb.DatabaseError as e:
            error, = e.args
            print("❌ Fault at the connection:")
            print(error.message)
            return {"hiba": error.message}

        # Alap SQL
        sql = """SELECT 
                    E_E_H.ID AS "HISTORY_ID",
                    E_E_H.REPORTED_TIME AS "REPORTED_TIME",
                    E_E_H.HISTORY_DESC AS "DESCRIPTION",
                    (SELECT (E_U.FIRST_NAME || ' ' || E_U.LAST_NAME) FROM ER_USERS E_U WHERE E_U.ID = E_E_H.USER_ID) AS "USER_NAME"
                FROM ER_EVENTS_HISTORY E_E_H
                JOIN ER_USERS_DEPARTMENTS E_U_D_C ON E_E_H.USER_ID = E_U_D_C.USER_ID
                JOIN ER_USERS_DEPARTMENTS E_U_D_S ON E_U_D_S.DEPARTMENT_ID = E_U_D_C.DEPARTMENT_ID
                WHERE 1=1
        """
        
        params = {}

        # Csak dátum alapján szűrés (idő figyelmen kívül hagyva)
        if fromDate is not None and toDate is not None:
            sql += " AND TRUNC(E_E_H.REPORTED_TIME) BETWEEN TO_DATE(:fromDate, 'YYYY-MM-DD') AND TO_DATE(:toDate, 'YYYY-MM-DD')"
            params["fromDate"] = fromDate
            params["toDate"] = toDate
        
        # Felhasználó szűrés
        if user_id is not None:
            sql += " AND E_U_D_S.USER_ID = :user_id"
            params["user_id"] = user_id
        
        sql += " ORDER BY E_E_H.REPORTED_TIME DESC"

        print("➡️  Query progress")
        cursor.execute(sql, params)
        print("✅ Query executed")

        if cursor.description is None:
            print("❗ A lekérdezés üres")
            data = []
        else:
            data = fetch_all_dict(cursor)
            print(f"✅ {len(data)} sor betöltve")
        return {"eredmeny": data}

    except Exception as e:
        print(f"❌ Hiba: {e}")
        return {"hiba": str(e)}

    finally:
        try:
            cursor.close()
            connection.close()
        except:
            pass

@app.post("/add_new_history_element")
async def add_new_history_element(user_id: int, description: str):
    try:
        try:
            # oracledb.init_oracle_client(lib_dir="C:\\instantclient_11_2")
            oracledb.init_oracle_client(lib_dir="/opt/oracle/instantclient")
            connection = oracledb.connect(user=DB_USER_misz, password=DB_PASS_misz, dsn=DB_DSN_misz)
            print("✅ Connect to the Oracle")
            cursor = connection.cursor()
        except oracledb.DatabaseError as e:
            error, = e.args
            print("❌ Fault at the connection:")
            print(error.message)
            return {"hiba": error.message}

        # Alap SQL
        sql = """INSERT INTO ER_EVENTS_HISTORY (
                        REPORTED_TIME,
                        HISTORY_DESC,
                        USER_ID
                    )
                VALUES 
                    (   SYSDATE, 
                        :description,
                        :user_id
                    )
        """
        
        cursor.execute(sql, {
            "user_id": user_id,
            "description": description
        })

        connection.commit()
        return {"status": "Sikeres beszúrás"}

    except Exception as e:
        print(f"❌ Hiba: {e}")
        return {"hiba": str(e)}

    finally:
        try:
            cursor.close()
            connection.close()
        except:
            pass

app.include_router(auth_router)
app.include_router(ai_ask_router)
