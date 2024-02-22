import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"

import { UserEntity } from "./user.entity"

@Entity("session")
export class SessionEntity {
  @PrimaryGeneratedColumn("uuid")
      sessionId: string

  @Column({ type: "uuid", length: "36" })
      userId: string

  @CreateDateColumn()
      createdAt: Date
  
  @UpdateDateColumn()
      updatedAt: Date

  @Column({ type: "boolean", default: false })
      isDisabled: boolean

  @Column({ type: "int", default: 0 })
      numberOfUpdates: number

  @Column({
      type: "uuid", length: "36"
  })
      clientId: string

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  @JoinColumn({ name: "userId" })
      user: UserEntity
}
